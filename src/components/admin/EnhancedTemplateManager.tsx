import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Receipt, Download, Eye, RefreshCw } from "lucide-react";
import { ChallanTemplateManagerV2 } from "./ChallanTemplateManagerV2";
import { QuotationTemplateManagerV2 } from "./QuotationTemplateManagerV2";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

export const EnhancedTemplateManager = () => {
  const { supabase } = useSupabase();
  const [challanCount, setChallanCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplateCounts();
  }, []);

  const loadTemplateCounts = async () => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('challan_templates')
        .select('*', { count: 'exact', head: true });

      setChallanCount(count || 0);
    } catch (error) {
      console.error('Error loading template counts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Enhanced Template Manager</h2>
        <p className="text-muted-foreground">Manage Challan and Quotation templates with automatic list updates</p>
      </div>

      {/* Available Templates Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Receipt className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Challan Templates ({challanCount})</h3>
              <p className="text-sm text-muted-foreground">Professional delivery challans</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              <span>Preview Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span>PDF Export</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Quotation Templates</h3>
              <p className="text-sm text-muted-foreground">Professional price quotes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              <span>Preview Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span>PDF Export</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={loadTemplateCounts} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Template Counts
        </Button>
      </div>

      {/* Template Managers */}
      <Tabs defaultValue="challan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challan" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Challan Templates
          </TabsTrigger>
          <TabsTrigger value="quotation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quotation Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challan">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">✨ Auto-Update Feature</h4>
              <p className="text-sm text-blue-700">
                New challan templates are automatically added to your available templates list. 
                Create a template below and it will instantly appear in your template library.
              </p>
            </div>
            <ChallanTemplateManagerV2 />
          </div>
        </TabsContent>

        <TabsContent value="quotation">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">✨ Auto-Update Feature</h4>
              <p className="text-sm text-green-700">
                New quotation templates are automatically added to your available templates list. 
                Create a template below and it will instantly appear in your template library.
              </p>
            </div>
            <QuotationTemplateManagerV2 />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};