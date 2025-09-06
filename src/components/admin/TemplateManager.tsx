import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Receipt, Download, Eye } from "lucide-react";
import { ChallanTemplateManagerV2 } from "./ChallanTemplateManagerV2";
import { QuotationTemplateManagerV2 } from "./QuotationTemplateManagerV2";

export const TemplateManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Template Manager</h2>
        <p className="text-muted-foreground">Manage Challan and Quotation templates</p>
      </div>

      {/* Available Templates Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Receipt className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Challan Templates</h3>
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
          <ChallanTemplateManagerV2 />
        </TabsContent>

        <TabsContent value="quotation">
          <QuotationTemplateManagerV2 />
        </TabsContent>
      </Tabs>
    </div>
  );
};