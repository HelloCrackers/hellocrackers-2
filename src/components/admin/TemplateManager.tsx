import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt } from "lucide-react";
import { ChallanTemplateManagerV2 } from "./ChallanTemplateManagerV2";
import { EnhancedAvailableTemplates } from "./EnhancedAvailableTemplates";

type Template = {
  id: string;
  name: string;
  type: 'challan';
  is_default: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  template_data: any;
};

export const TemplateManager = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setActiveTab("challan");
  };

  const handlePreviewTemplate = (template: Template) => {
    setEditingTemplate(template);
    setActiveTab("challan");
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setActiveTab("challan");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Template Manager</h2>
        <p className="text-muted-foreground">Manage Challan templates with auto-update functionality</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Available Templates
          </TabsTrigger>
          <TabsTrigger value="challan" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Challan Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <EnhancedAvailableTemplates 
            onEditTemplate={handleEditTemplate}
            onPreviewTemplate={handlePreviewTemplate}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>

        <TabsContent value="challan">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">✨ Auto-Update Feature</h4>
              <p className="text-sm text-blue-700">
                New challan templates are automatically added to your Available Templates list. 
                Create or save a template below and it will instantly appear in your template library.
              </p>
            </div>
            <ChallanTemplateManagerV2 />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};