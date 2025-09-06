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
  Plus, Edit3, Download, Save, Trash2, Upload,
  FileText, Building, User, Calendar, Package, Image as ImageIcon
} from "lucide-react";

interface QuotationTemplate {
  id?: string;
  name: string;
  is_default: boolean;
  template_data: {
    company_info: {
      logo_url: string;
      name: string;
      address: string;
      phone: string;
      email: string;
      gst_number: string;
    };
    quotation_settings: {
      validity_days: number;
      terms_conditions: string[];
      payment_terms: string;
      delivery_terms: string;
    };
    styling: {
      primary_color: string;
      secondary_color: string;
      font_family: string;
    };
  };
}

export const QuotationTemplateManagerV2 = () => {
  const { supabase, uploadFile } = useSupabase();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuotationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const defaultTemplate: QuotationTemplate = {
    name: "Default Quotation Template",
    is_default: true,
    template_data: {
      company_info: {
        logo_url: "/hello-crackers-logo.jpg",
        name: "Hello Crackers",
        address: "123 Business Street, City, State - 123456",
        phone: "+91 9876543210",
        email: "sales@hellocrackers.com",
        gst_number: "GST123456789"
      },
      quotation_settings: {
        validity_days: 30,
        terms_conditions: [
          "Prices are valid for 30 days from the date of quotation",
          "All prices are inclusive of GST",
          "Delivery charges extra if applicable",
          "Payment terms: 50% advance, 50% on delivery"
        ],
        payment_terms: "50% Advance, 50% on Delivery",
        delivery_terms: "3-5 working days from confirmation"
      },
      styling: {
        primary_color: "#2563eb",
        secondary_color: "#64748b",
        font_family: "Inter, sans-serif"
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
      setTemplates(data as unknown as QuotationTemplate[] || []);
      
      if (data && data.length > 0) {
        setSelectedTemplate(data[0] as unknown as QuotationTemplate);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const { success, url } = await uploadFile('content', `logos/${Date.now()}_${file.name}`, file);
      if (success && url) {
        updateTemplateField('company_info.logo_url', url);
        toast({ title: "Logo uploaded successfully" });
      } else {
        toast({ title: "Failed to upload logo", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to upload logo", variant: "destructive" });
    } finally {
      setLogoUploading(false);
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
        type: 'quotation'
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
        description: "Quotation template has been updated successfully.",
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
    const newTemplate: QuotationTemplate = {
      ...defaultTemplate,
      name: "New Quotation Template",
      is_default: false
    };
    setSelectedTemplate(newTemplate);
    setIsCreating(true);
    setIsEditing(true);
  };

  const generateQuotationPDF = async () => {
    toast({
      title: "PDF Generation",
      description: "Generating quotation PDF template...",
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
        <h2 className="text-2xl font-bold">Quotation Template Manager</h2>
        <div className="flex gap-2">
          <Button onClick={createNewTemplate} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={generateQuotationPDF} variant="outline">
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
              <TabsTrigger value="settings">Quotation Settings</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
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

                  <div className="md:col-span-2">
                    <Label htmlFor="logo-upload">Company Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={!isEditing || logoUploading}
                        />
                      </div>
                      {logoUploading && (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>
                    {selectedTemplate.template_data.company_info.logo_url && (
                      <div className="mt-2">
                        <img 
                          src={selectedTemplate.template_data.company_info.logo_url} 
                          alt="Company Logo" 
                          className="h-20 w-auto object-contain border rounded p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Quotation Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="validity-days">Validity (Days)</Label>
                    <Input
                      id="validity-days"
                      type="number"
                      value={selectedTemplate.template_data.quotation_settings.validity_days}
                      onChange={(e) => updateTemplateField('quotation_settings.validity_days', parseInt(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Input
                      id="payment-terms"
                      value={selectedTemplate.template_data.quotation_settings.payment_terms}
                      onChange={(e) => updateTemplateField('quotation_settings.payment_terms', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="delivery-terms">Delivery Terms</Label>
                    <Input
                      id="delivery-terms"
                      value={selectedTemplate.template_data.quotation_settings.delivery_terms}
                      onChange={(e) => updateTemplateField('quotation_settings.delivery_terms', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="terms-conditions">Terms & Conditions</Label>
                    <Textarea
                      id="terms-conditions"
                      value={selectedTemplate.template_data.quotation_settings.terms_conditions.join('\n')}
                      onChange={(e) => updateTemplateField('quotation_settings.terms_conditions', e.target.value.split('\n'))}
                      disabled={!isEditing}
                      rows={6}
                      placeholder="Enter each term on a new line"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="styling" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Template Styling</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={selectedTemplate.template_data.styling.primary_color}
                        onChange={(e) => updateTemplateField('styling.primary_color', e.target.value)}
                        disabled={!isEditing}
                        className="w-20"
                      />
                      <Input
                        value={selectedTemplate.template_data.styling.primary_color}
                        onChange={(e) => updateTemplateField('styling.primary_color', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={selectedTemplate.template_data.styling.secondary_color}
                        onChange={(e) => updateTemplateField('styling.secondary_color', e.target.value)}
                        disabled={!isEditing}
                        className="w-20"
                      />
                      <Input
                        value={selectedTemplate.template_data.styling.secondary_color}
                        onChange={(e) => updateTemplateField('styling.secondary_color', e.target.value)}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <select
                      value={selectedTemplate.template_data.styling.font_family}
                      onChange={(e) => updateTemplateField('styling.font_family', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Helvetica, sans-serif">Helvetica</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                    </select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
                
                <div className="border rounded p-6 bg-white text-black" style={{ fontFamily: selectedTemplate.template_data.styling.font_family }}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold" style={{ color: selectedTemplate.template_data.styling.primary_color }}>
                        QUOTATION
                      </h1>
                      <p className="text-sm text-gray-600">#{new Date().getFullYear()}-QT-001</p>
                    </div>
                    <div className="text-right">
                      {selectedTemplate.template_data.company_info.logo_url && (
                        <img 
                          src={selectedTemplate.template_data.company_info.logo_url} 
                          alt="Company Logo" 
                          className="h-16 w-auto mb-2 ml-auto"
                        />
                      )}
                      <h2 className="text-xl font-bold">{selectedTemplate.template_data.company_info.name}</h2>
                      <p className="text-sm">{selectedTemplate.template_data.company_info.address}</p>
                      <p className="text-sm">Ph: {selectedTemplate.template_data.company_info.phone}</p>
                      <p className="text-sm">{selectedTemplate.template_data.company_info.email}</p>
                      <p className="text-sm">GST: {selectedTemplate.template_data.company_info.gst_number}</p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Bill To:</h3>
                      <p>Sample Customer Name</p>
                      <p>Sample Address Line 1</p>
                      <p>City, State - 123456</p>
                      <p>Phone: +91 9876543210</p>
                    </div>
                    <div>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Valid Until:</strong> {new Date(Date.now() + selectedTemplate.template_data.quotation_settings.validity_days * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">S.No</th>
                        <th className="border border-gray-300 p-2 text-left">Description</th>
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
                        <td className="border border-gray-300 p-2">₹50.00</td>
                        <td className="border border-gray-300 p-2">₹500.00</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="border border-gray-300 p-2 text-right font-semibold">Total:</td>
                        <td className="border border-gray-300 p-2 font-semibold">₹500.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
                    {selectedTemplate.template_data.quotation_settings.terms_conditions.map((term, index) => (
                      <p key={index} className="text-sm">• {term}</p>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm"><strong>Payment Terms:</strong> {selectedTemplate.template_data.quotation_settings.payment_terms}</p>
                      <p className="text-sm"><strong>Delivery Terms:</strong> {selectedTemplate.template_data.quotation_settings.delivery_terms}</p>
                    </div>
                    <div className="text-right">
                      <div className="border-t border-black w-32 mb-1"></div>
                      <p className="text-sm">Authorized Signature</p>
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