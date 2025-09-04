import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Database, Upload, CheckCircle } from "lucide-react";
import { bulkProductData } from "@/utils/productData";

export const QuickDataImport = () => {
  const { bulkCreateProducts } = useSupabase();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleQuickImport = async () => {
    setImporting(true);
    try {
      const result = await bulkCreateProducts(bulkProductData);
      
      toast({
        title: "Import Complete",
        description: `${result.successCount} products imported successfully. ${result.errorCount} errors.`,
      });
      
      if (result.errors.length > 0) {
        console.error("Import errors:", result.errors);
      }
      
      setImportComplete(true);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import product data",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Quick Data Import</h3>
            <p className="text-sm text-muted-foreground">
              Import the complete product catalog with {bulkProductData.length} products
            </p>
          </div>
        </div>

        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            This will import all {bulkProductData.length} products from H001 to H190 with proper categories, 
            pricing, and stock information. Existing products will be updated.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={handleQuickImport} 
            disabled={importing || importComplete}
            className="flex-1"
          >
            {importing ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : importComplete ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Import Complete
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Import {bulkProductData.length} Products
              </>
            )}
          </Button>
        </div>

        {importComplete && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Product import completed successfully! All products are now available in the system.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};