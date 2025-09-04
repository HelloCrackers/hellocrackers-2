import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, Download, FileSpreadsheet, Archive, 
  AlertTriangle, CheckCircle, Info
} from "lucide-react";
import { 
  processExcelFile, 
  processZipFile, 
  generateProductTemplate, 
  generateErrorLog, 
  ProcessResult, 
  MediaProcessResult 
} from "@/utils/fileProcessing";

export const BulkUploadManager = () => {
  const { fetchProducts, bulkCreateProducts, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Load products for ZIP validation
  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload .xlsx, .xls, or .csv files only",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const result: ProcessResult = await processExcelFile(file);
      
      if (!result.success) {
        generateErrorLog(result.errors, [], `excel_upload_errors_${Date.now()}`);
        toast({
          title: "Upload Failed with Errors",
          description: `Found ${result.errorCount} errors. Error log downloaded automatically.`,
          variant: "destructive"
        });
        return;
      }

      // Use the bulk create function for better performance
      const productsToCreate = result.data?.map(product => ({
        product_code: product.productCode,
        product_name: product.productName,
        category: product.category,
        user_for: product.userFor,
        mrp: product.mrp,
        discount: product.discount,
        final_rate: product.finalRate,
        stock: product.stock,
        description: product.description || '',
        content: product.content || '',
        image_url: '',
        video_url: '',
        rating: 0,
        reviews_count: 0,
        status: 'active' as 'active' | 'inactive',
        featured: false
      })) || [];

      const bulkResult = await bulkCreateProducts(productsToCreate);
      
      toast({
        title: "Bulk Upload Completed",
        description: `${bulkResult.successCount} products created successfully. ${bulkResult.errorCount} failed.`,
        variant: bulkResult.errorCount > 0 ? "destructive" : "default"
      });
      
      // Generate error log if there are errors
      if (bulkResult.errors.length > 0) {
        generateErrorLog(bulkResult.errors.map(error => ({
          row: 0,
          field: 'Product',
          message: error
        })), [], `bulk_create_errors_${Date.now()}`);
      }

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process Excel file",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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
      const result: MediaProcessResult = await processZipFile(file, productCodes, false);
      
      if (!result.success) {
        generateErrorLog(result.errors, [], `zip_upload_errors_${Date.now()}`);
        toast({
          title: "Upload Failed with Errors",
          description: `${result.unmappedCount} folders don't match product codes. Error log downloaded.`,
          variant: "destructive"
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const processedFile of result.processedFiles) {
        try {
          const fileName = `${Date.now()}_${processedFile.file.name}`;
          const uploadResult = await uploadFile('products', fileName, processedFile.file);
          
          if (uploadResult.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${processedFile.file.name}:`, error);
        }
      }

      toast({
        title: "Media Upload Completed",
        description: `${successCount} files uploaded successfully. ${errorCount} failed.`,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bulk Upload Manager</h2>
        <Button variant="outline" onClick={generateProductTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      <Tabs defaultValue="excel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="excel">Product Data (Excel/CSV)</TabsTrigger>
          <TabsTrigger value="media">Media Files (ZIP)</TabsTrigger>
        </TabsList>

        <TabsContent value="excel" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Product Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload product details via Excel (.xlsx, .xls) or CSV (.csv) format.
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Mandatory Columns:</strong> Product Code, Product Name, Category, User For, Price (₹), Discount %, Final Rate (₹), Quantity
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="excel-upload">Choose File</Label>
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    disabled={processing}
                  />
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <p>• Upload file in .xlsx, .xls, or .csv format only.</p>
                    <p>• Ensure all mandatory columns are filled.</p>
                    <p>• Final Rate = Price - (Price × Discount %)</p>
                    <p>• Do not use merged cells or special characters in Product Code.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Required Column Format:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      'Product Code', 'Product Name', 'Category', 'User For',
                      'Price (₹)', 'Discount %', 'Final Rate (₹)', 'Quantity'
                    ].map((col) => (
                      <Badge key={col} variant="outline" className="justify-center">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {processing && (
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Processing Excel file... This may take a few minutes.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Expected ZIP Structure:</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <div>your-media.zip</div>
                    <div className="ml-2">├── P1234/</div>
                    <div className="ml-4">├── image1.jpg</div>
                    <div className="ml-4">└── video1.mp4</div>
                    <div className="ml-2">├── P1235/</div>
                    <div className="ml-4">├── image2.jpg</div>
                    <div className="ml-4">└── image3.png</div>
                  </div>
                </div>
              </div>

              {processing && (
                <Alert>
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Processing ZIP file... This may take a few minutes.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Error Handling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Excel Upload Errors
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Row 12 → Missing Product Code</li>
              <li>• Row 20 → Invalid Price Format</li>
              <li>• Row 25 → Final Rate calculation mismatch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Auto Downloads
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Error logs saved as .txt files</li>
              <li>• Detailed error descriptions</li>
              <li>• Fix suggestions included</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};