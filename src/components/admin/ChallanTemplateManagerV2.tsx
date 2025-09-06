import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit3, Download, Save, Trash2, 
  FileText, Building, User, Calendar, Package 
} from "lucide-react";

interface ChallanTemplate {
  id?: string;
  name: string;
  is_default: boolean;
  template_data: {
    company_info: {
      name: string;
      address: string;
      phone: string;
      email: string;
      gst_number: string;
    };
    challan_settings: {
      prefix: string;
      starting_number: number;
      date_format: string;
      auto_increment: boolean;
    };
    fields: {
      show_customer_details: boolean;
      show_product_details: boolean;
      show_quantities: boolean;
      show_rates: boolean;
      show_totals: boolean;
      custom_fields: Array<{
        name: string;
        type: 'text' | 'number' | 'date';
        required: boolean;
      }>;
    };
    footer: {
      terms: string[];
      signature_line: boolean;
      prepared_by: string;
    };
  };
}

export const ChallanTemplateManagerV2 = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ChallanTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallanTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const defaultTemplate: ChallanTemplate = {
    name: "Default Challan Template",
    is_default: true,
    template_data: {
      company_info: {
        name: "Hello Crackers",
        address: "123 Business Street, City, State - 123456",
        phone: "+91 9876543210",
        email: "sales@hellocrackers.com",
        gst_number: "GST123456789"
      },
      challan_settings: {
        prefix: "CH",
        starting_number: 1001,
        date_format: "DD/MM/YYYY",
        auto_increment: true
      },
      fields: {
        show_customer_details: true,
        show_product_details: true,
        show_quantities: true,
        show_rates: true,
        show_totals: true,
        custom_fields: [
          { name: "Vehicle Number", type: "text", required: false },
          { name: "Driver Name", type: "text", required: false },
          { name: "Expected Delivery", type: "date", required: false }
        ]
      },
      footer: {
        terms: [
          "Goods delivered in good condition",
          "This is a computer generated challan",
          "For any queries, contact us at the above number"
        ],
        signature_line: true,
        prepared_by: "Sales Team"
      }
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('challan_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTemplates(data as unknown as ChallanTemplate[] || []);
      
      if (data && data.length > 0) {
        setSelectedTemplate(data[0] as unknown as ChallanTemplate);
      } else {
        setTemplates([defaultTemplate]);
        setSelectedTemplate(defaultTemplate);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([defaultTemplate]);
      setSelectedTemplate(defaultTemplate);
    }
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      // Generate thumbnail from preview
      const thumbnail = await generateThumbnail();
      
      const templateData = {
        name: selectedTemplate.name,
        template_data: selectedTemplate.template_data,
        is_default: selectedTemplate.is_default,
        thumbnail_url: thumbnail,
        type: 'challan'
      };

      if (isCreating) {
        const { error } = await supabase
          .from('challan_templates')
          .insert([templateData]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('challan_templates')
          .update(templateData)
          .eq('id', selectedTemplate.id);
        
        if (error) throw error;
      }

      toast({
        title: "Template Saved",
        description: "Challan template has been updated successfully.",
      });
      setIsEditing(false);
      setIsCreating(false);
      loadTemplates();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateThumbnail = async (): Promise<string> => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const previewElement = document.querySelector('.template-preview');
      
      if (previewElement) {
        const canvas = await html2canvas(previewElement as HTMLElement, {
          scale: 0.5,
          width: 400,
          height: 300
        });
        return canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    }
    return '';
  };

  const createNewTemplate = () => {
    const newTemplate: ChallanTemplate = {
      ...defaultTemplate,
      name: "New Challan Template",
      is_default: false
    };
    setSelectedTemplate(newTemplate);
    setIsCreating(true);
    setIsEditing(true);
  };

  const generateChallanPDF = async () => {
    toast({
      title: "PDF Generation",
      description: "Generating challan PDF template...",
    });
    // Implement PDF generation logic
  };

  const updateTemplateField = (field: string, value: any) => {
    if (!selectedTemplate) return;
    
    const fieldPath = field.split('.');
    const updatedTemplate = { ...selectedTemplate };
    let current = updatedTemplate.template_data as any;
    
    for (let i = 0; i < fieldPath.length - 1; i++) {
      current = current[fieldPath[i]];
    }
    current[fieldPath[fieldPath.length - 1]] = value;
    
    setSelectedTemplate(updatedTemplate);
  };

  if (!selectedTemplate) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading templates...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Challan Template Manager</h2>
        <div className="flex gap-2">
          <Button onClick={createNewTemplate} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={generateChallanPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
          {isEditing && (
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template List Sidebar */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Available Templates</h3>
          <div className="space-y-2">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`p-3 rounded cursor-pointer border ${
                  selectedTemplate?.name === template.name 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted'
                }`}
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsEditing(false);
                  setIsCreating(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    {template.is_default && (
                      <Badge variant="outline" className="text-xs mt-1">Default</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setIsEditing(true);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Template Editor */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="company" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="company">Company Info</TabsTrigger>
              <TabsTrigger value="settings">Challan Settings</TabsTrigger>
              <TabsTrigger value="fields">Fields & Layout</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={selectedTemplate.name}
                      onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={selectedTemplate.template_data.company_info.name}
                      onChange={(e) => updateTemplateField('company_info.name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gst-number">GST Number</Label>
                    <Input
                      id="gst-number"
                      value={selectedTemplate.template_data.company_info.gst_number}
                      onChange={(e) => updateTemplateField('company_info.gst_number', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea
                      id="company-address"
                      value={selectedTemplate.template_data.company_info.address}
                      onChange={(e) => updateTemplateField('company_info.address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input
                      id="company-phone"
                      value={selectedTemplate.template_data.company_info.phone}
                      onChange={(e) => updateTemplateField('company_info.phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company-email">Email Address</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={selectedTemplate.template_data.company_info.email}
                      onChange={(e) => updateTemplateField('company_info.email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Challan Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="challan-prefix">Challan Prefix</Label>
                    <Input
                      id="challan-prefix"
                      value={selectedTemplate.template_data.challan_settings.prefix}
                      onChange={(e) => updateTemplateField('challan_settings.prefix', e.target.value)}
                      disabled={!isEditing}
                      placeholder="CH"
                    />
                  </div>

                  <div>
                    <Label htmlFor="starting-number">Starting Number</Label>
                    <Input
                      id="starting-number"
                      type="number"
                      value={selectedTemplate.template_data.challan_settings.starting_number}
                      onChange={(e) => updateTemplateField('challan_settings.starting_number', parseInt(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Input
                      id="date-format"
                      value={selectedTemplate.template_data.challan_settings.date_format}
                      onChange={(e) => updateTemplateField('challan_settings.date_format', e.target.value)}
                      disabled={!isEditing}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prepared-by">Prepared By</Label>
                    <Input
                      id="prepared-by"
                      value={selectedTemplate.template_data.footer.prepared_by}
                      onChange={(e) => updateTemplateField('footer.prepared_by', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="footer-terms">Footer Terms</Label>
                    <Textarea
                      id="footer-terms"
                      value={selectedTemplate.template_data.footer.terms.join('\n')}
                      onChange={(e) => updateTemplateField('footer.terms', e.target.value.split('\n'))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Enter each term on a new line"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="fields" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Field Configuration</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Display Fields</h4>
                    {[
                      { key: 'show_customer_details', label: 'Customer Details' },
                      { key: 'show_product_details', label: 'Product Details' },
                      { key: 'show_quantities', label: 'Quantities' },
                      { key: 'show_rates', label: 'Rates' },
                      { key: 'show_totals', label: 'Totals' }
                    ].map(field => (
                      <label key={field.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTemplate.template_data.fields[field.key as keyof typeof selectedTemplate.template_data.fields] as boolean}
                          onChange={(e) => updateTemplateField(`fields.${field.key}`, e.target.checked)}
                          disabled={!isEditing}
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Custom Fields</h4>
                    <div className="space-y-2">
                      {selectedTemplate.template_data.fields.custom_fields.map((field, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={field.name}
                            onChange={(e) => {
                              const updatedFields = [...selectedTemplate.template_data.fields.custom_fields];
                              updatedFields[index] = { ...field, name: e.target.value };
                              updateTemplateField('fields.custom_fields', updatedFields);
                            }}
                            disabled={!isEditing}
                            placeholder="Field name"
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
                
                <div className="border rounded p-6 bg-white text-black template-preview" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">DELIVERY CHALLAN</h1>
                    <p className="text-lg font-semibold">{selectedTemplate.template_data.company_info.name}</p>
                    <p className="text-sm">{selectedTemplate.template_data.company_info.address}</p>
                    <p className="text-sm">Ph: {selectedTemplate.template_data.company_info.phone} | Email: {selectedTemplate.template_data.company_info.email}</p>
                    <p className="text-sm">GST: {selectedTemplate.template_data.company_info.gst_number}</p>
                  </div>

                  {/* Challan Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p><strong>Challan No:</strong> {selectedTemplate.template_data.challan_settings.prefix}{selectedTemplate.template_data.challan_settings.starting_number}</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><strong>Customer:</strong> Sample Customer</p>
                      <p><strong>Address:</strong> Sample Address</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">S.No</th>
                        <th className="border border-gray-300 p-2 text-left">Product</th>
                        <th className="border border-gray-300 p-2 text-left">Qty</th>
                        <th className="border border-gray-300 p-2 text-left">Rate</th>
                        <th className="border border-gray-300 p-2 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">Sample Product</td>
                        <td className="border border-gray-300 p-2">10</td>
                        <td className="border border-gray-300 p-2">₹50</td>
                        <td className="border border-gray-300 p-2">₹500</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Footer */}
                  <div className="mt-8">
                    <div className="text-sm">
                      {selectedTemplate.template_data.footer.terms.map((term, index) => (
                        <p key={index}>• {term}</p>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <div>
                        <p className="text-sm">Prepared by: {selectedTemplate.template_data.footer.prepared_by}</p>
                      </div>
                      {selectedTemplate.template_data.footer.signature_line && (
                        <div className="text-right">
                          <div className="border-t border-black w-32 mb-1"></div>
                          <p className="text-sm">Authorized Signature</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};