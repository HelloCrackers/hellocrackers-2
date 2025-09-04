import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, Archive, Info, AlertTriangle, CheckCircle
} from "lucide-react";
import { 
  processZipFile, 
  generateErrorLog, 
  MediaProcessResult 
} from "@/utils/fileProcessing";

export const ZipUploadManager = () => {
  const { fetchProducts, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [removeBackgrounds, setRemoveBackgrounds] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Load products for ZIP validation
  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload .zip files only",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Load products if not already loaded
      if (products.length === 0) {
        await loadProducts();
      }

      const productCodes = products.map(p => p.product_code);
      const result: MediaProcessResult = await processZipFile(file, productCodes, removeBackgrounds);
      
      if (!result.success && result.unmappedCount > 0) {
        generateErrorLog(result.errors, [], `zip_mapping_errors_${Date.now()}`);
        toast({
          title: "Upload Failed with Mapping Errors",
          description: `${result.unmappedCount} folders don't match product codes. Error log downloaded.`,
          variant: "destructive"
        });
      }

      let successCount = 0;
      let errorCount = 0;
      const uploadPromises = [];

      // Process mapped files
      for (const processedFile of result.processedFiles) {
        if (processedFile.error) {
          errorCount++;
          continue;
        }

        const fileToUpload = processedFile.processedBlob || processedFile.file;
        const fileName = `${Date.now()}_${processedFile.file.name}`;
        
        const uploadPromise = uploadFile('products', fileName, new File([fileToUpload], fileName))
          .then(uploadResult => {
            if (uploadResult.success) {
              successCount++;
            } else {
              errorCount++;
            }
          })
          .catch(() => {
            errorCount++;
          });
        
        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      toast({
        title: "Media Upload Completed",
        description: `${successCount} files uploaded successfully. ${errorCount} failed. ${result.mappedCount} mapped, ${result.unmappedCount} unmapped.`,
        variant: errorCount > 0 ? "destructive" : "default"
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process ZIP file",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload product images/videos in .zip format with folder mapping.
          </p>
        </div>

        <Alert>
          <Archive className="h-4 w-4" />
          <AlertDescription>
            <strong>Folder Mapping:</strong> Each folder inside ZIP must be named as the Product Code. Example: Product Code P1234 → Folder P1234 containing images/videos.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="background-removal"
              checked={removeBackgrounds}
              onCheckedChange={setRemoveBackgrounds}
            />
            <Label htmlFor="background-removal">
              Remove backgrounds from images (slower processing)
            </Label>
          </div>

          <div>
            <Label htmlFor="zip-upload">Choose ZIP File</Label>
            <Input
              id="zip-upload"
              type="file"
              accept=".zip"
              onChange={handleZipUpload}
              disabled={processing}
            />
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>• Upload product media in .zip format only.</p>
              <p>• Each folder inside ZIP must be named as the Product Code.</p>
              <p>• Images/videos will auto-link to the respective product.</p>
              <p>• Supported formats: JPG, PNG, WEBP, MP4, WEBM, MOV</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Expected ZIP Structure:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <div>your-media.zip</div>
              <div className="ml-2">├── H001/</div>
              <div className="ml-4">├── selfie-stick.jpg</div>
              <div className="ml-4">└── video-demo.mp4</div>
              <div className="ml-2">├── H002/</div>
              <div className="ml-4">├── photo-flash.jpg</div>
              <div className="ml-4">└── product-demo.mp4</div>
              <div className="ml-2">└── H003/</div>
              <div className="ml-4">└── amazing-pencil.png</div>
            </div>
          </div>

          {processing && (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Processing ZIP file... This may take several minutes {removeBackgrounds ? "(background removal enabled)" : ""}.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Processing Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p><strong>✓ Mapped Files:</strong> Folders matching product codes</p>
              <p><strong>✗ Unmapped Files:</strong> Folders with no matching product codes</p>
            </div>
            <div>
              <p><strong>Background Removal:</strong> Uses AI to remove backgrounds from images</p>
              <p><strong>Error Log:</strong> Downloaded automatically if mapping errors occur</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};