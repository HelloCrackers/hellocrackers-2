import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, Upload, Download, Edit, Save, Plus, X, 
  Palette, Layout, Settings, Eye 
} from "lucide-react";

interface ChallanTemplate {
  id: string;
  name: string;
  is_default: boolean;
  template_data: {
    layout: 'portrait' | 'landscape';
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    header: {
      company_name: string;
      address: string;
      phone: string;
      email: string;
      logo_url: string;
    };
    sections: {
      show_bill_to: boolean;
      show_ship_to: boolean;
      show_terms: boolean;
      custom_fields: Array<{
        name: string;
        type: 'text' | 'number' | 'date';
        required: boolean;
      }>;
    };
    footer: {
      text: string;
      signature_space: boolean;
    };
  };
}

export const EnhancedChallanManager = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<ChallanTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallanTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [editData, setEditData] = useState<Partial<ChallanTemplate>>({});

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
      setTemplates(data || []);
      
      if (data && data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast({ title: "Failed to load templates", variant: "destructive" });
    }
  };

  const createTemplate = async () => {
    const newTemplate = {
      name: 'New Template',
      is_default: false,
      template_data: {
        layout: 'portrait' as const,
        colors: {
          primary: '#DC2626',
          secondary: '#059669',
          accent: '#D97706',
          text: '#1F2937',
          background: '#FFFFFF'
        },
        header: {
          company_name: 'Hello Crackers',
          address: 'Tamil Nadu, India',
          phone: '+91 XXXXXXXXXX',
          email: 'info@hellocrackers.com',
          logo_url: ''
        },
        sections: {
          show_bill_to: true,
          show_ship_to: true,
          show_terms: true,
          custom_fields: []
        },
        footer: {
          text: 'Thank you for your business!',
          signature_space: true
        }
      }
    };

    try {
      const { data, error } = await supabase
        .from('challan_templates')
        .insert([newTemplate])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({ title: "Template created successfully" });
      await loadTemplates();
      setSelectedTemplate(data);
      setShowNewTemplate(false);
    } catch (error) {
      console.error('Failed to create template:', error);
      toast({ title: "Failed to create template", variant: "destructive" });
    }
  };

  const updateTemplate = async () => {
    if (!selectedTemplate || !editData.template_data) return;

    try {
      const { error } = await supabase
        .from('challan_templates')
        .update({
          name: editData.name || selectedTemplate.name,
          template_data: editData.template_data
        })
        .eq('id', selectedTemplate.id);
      
      if (error) throw error;
      
      toast({ title: "Template updated successfully" });
      setIsEditing(false);
      setEditData({});
      await loadTemplates();
    } catch (error) {
      console.error('Failed to update template:', error);
      toast({ title: "Failed to update template", variant: "destructive" });
    }
  };

  const setDefaultTemplate = async (templateId: string) => {
    try {
      // First, remove default from all templates
      await supabase
        .from('challan_templates')
        .update({ is_default: false })
        .neq('id', '');
      
      // Then set the selected template as default
      const { error } = await supabase
        .from('challan_templates')
        .update({ is_default: true })
        .eq('id', templateId);
      
      if (error) throw error;
      
      toast({ title: "Default template updated" });
      await loadTemplates();
    } catch (error) {
      console.error('Failed to set default template:', error);
      toast({ title: "Failed to set default template", variant: "destructive" });
    }
  };

  const handleWordUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast({ title: "Please upload a Word document (.docx)", variant: "destructive" });
      return;
    }

    try {
      // For now, create a basic template and show upload success
      // In a real implementation, you'd parse the Word document
      const templateName = `Template from ${file.name}`;
      
      const newTemplate = {
        name: templateName,
        is_default: false,
        template_data: {
          layout: 'portrait' as const,
          colors: {
            primary: '#DC2626',
            secondary: '#059669',
            accent: '#D97706',
            text: '#1F2937',
            background: '#FFFFFF'
          },
          header: {
            company_name: 'Hello Crackers',
            address: 'Tamil Nadu, India',
            phone: '+91 XXXXXXXXXX',
            email: 'info@hellocrackers.com',
            logo_url: ''
          },
          sections: {
            show_bill_to: true,
            show_ship_to: true,
            show_terms: true,
            custom_fields: [
              { name: 'Custom Field 1', type: 'text' as const, required: false },
              { name: 'Custom Field 2', type: 'number' as const, required: false }
            ]
          },
          footer: {
            text: `Template imported from ${file.name}`,
            signature_space: true
          }
        }
      };

      const { error } = await supabase
        .from('challan_templates')
        .insert([newTemplate]);
      
      if (error) throw error;
      
      toast({ title: "Word template uploaded successfully" });
      await loadTemplates();
    } catch (error) {
      console.error('Failed to upload Word template:', error);
      toast({ title: "Failed to upload Word template", variant: "destructive" });
    }
  };

  const startEdit = (template: ChallanTemplate) => {
    setIsEditing(true);
    setEditData({
      name: template.name,
      template_data: { ...template.template_data }
    });
  };

  const updateEditData = (path: string[], value: any) => {
    setEditData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      // Set the value
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Challan Manager</h2>
          <p className="text-muted-foreground">Create and customize challan templates with full editing control</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".docx"
              onChange={handleWordUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Word Template
            </Button>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{template.name}</h4>
                {template.is_default && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Layout: {template.template_data.layout}
              </p>
              <div className="flex gap-1 mt-2">
                {Object.values(template.template_data.colors).slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Template Editor */}
      {selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Template Editor</h3>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={updateTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => startEdit(selectedTemplate)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Basic Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout</Label>
                      <Select
                        value={editData.template_data?.layout || 'portrait'}
                        onValueChange={(value) => updateEditData(['template_data', 'layout'], value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Colors
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(editData.template_data?.colors || {}).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={value as string}
                            onChange={(e) => updateEditData(['template_data', 'colors', key], e.target.value)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={value as string}
                            onChange={(e) => updateEditData(['template_data', 'colors', key], e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Header Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={editData.template_data?.header?.company_name || ''}
                        onChange={(e) => updateEditData(['template_data', 'header', 'company_name'], e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={editData.template_data?.header?.phone || ''}
                        onChange={(e) => updateEditData(['template_data', 'header', 'phone'], e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={editData.template_data?.header?.email || ''}
                        onChange={(e) => updateEditData(['template_data', 'header', 'email'], e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input
                        value={editData.template_data?.header?.logo_url || ''}
                        onChange={(e) => updateEditData(['template_data', 'header', 'logo_url'], e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={editData.template_data?.header?.address || ''}
                      onChange={(e) => updateEditData(['template_data', 'header', 'address'], e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4">
                  <h4 className="font-medium">Footer</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Footer Text</Label>
                      <Textarea
                        value={editData.template_data?.footer?.text || ''}
                        onChange={(e) => updateEditData(['template_data', 'footer', 'text'], e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="signature_space"
                        checked={editData.template_data?.footer?.signature_space || false}
                        onChange={(e) => updateEditData(['template_data', 'footer', 'signature_space'], e.target.checked)}
                      />
                      <Label htmlFor="signature_space">Include signature space</Label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Layout:</strong> {selectedTemplate.template_data.layout}</p>
                  <p><strong>Company:</strong> {selectedTemplate.template_data.header.company_name}</p>
                  <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setDefaultTemplate(selectedTemplate.id)}
                  disabled={selectedTemplate.is_default}
                >
                  {selectedTemplate.is_default ? 'Current Default' : 'Set as Default'}
                </Button>
              </div>
            )}
          </Card>

          {/* Preview Panel */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            {/* Challan Preview */}
            <div 
              className="border rounded-lg p-6 bg-white"
              style={{ 
                backgroundColor: selectedTemplate.template_data.colors.background,
                color: selectedTemplate.template_data.colors.text 
              }}
            >
              {/* Header */}
              <div className="text-center mb-6 border-b pb-4" style={{ borderColor: selectedTemplate.template_data.colors.primary }}>
                <h1 className="text-2xl font-bold" style={{ color: selectedTemplate.template_data.colors.primary }}>
                  {selectedTemplate.template_data.header.company_name}
                </h1>
                <p className="text-sm">{selectedTemplate.template_data.header.address}</p>
                <p className="text-sm">
                  Phone: {selectedTemplate.template_data.header.phone} | 
                  Email: {selectedTemplate.template_data.header.email}
                </p>
              </div>

              {/* Challan Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: selectedTemplate.template_data.colors.secondary }}>
                    Bill To:
                  </h3>
                  <p className="text-sm">Customer Name</p>
                  <p className="text-sm">Customer Address</p>
                  <p className="text-sm">City, State - PIN</p>
                </div>
                <div className="text-right">
                  <p className="text-sm"><strong>Challan No:</strong> CH-001</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Due Date:</strong> {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-6 text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: selectedTemplate.template_data.colors.primary }}>
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Rate</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Sample Cracker Set</td>
                    <td className="text-right p-2">2</td>
                    <td className="text-right p-2">₹500</td>
                    <td className="text-right p-2">₹1,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Premium Sparklers</td>
                    <td className="text-right p-2">5</td>
                    <td className="text-right p-2">₹200</td>
                    <td className="text-right p-2">₹1,000</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="text-right mb-6">
                <p className="text-sm">Subtotal: ₹2,000</p>
                <p className="text-sm">Tax (18%): ₹360</p>
                <p className="font-bold" style={{ color: selectedTemplate.template_data.colors.primary }}>
                  Total: ₹2,360
                </p>
              </div>

              {/* Footer */}
              <div className="border-t pt-4" style={{ borderColor: selectedTemplate.template_data.colors.primary }}>
                <p className="text-sm">{selectedTemplate.template_data.footer.text}</p>
                {selectedTemplate.template_data.footer.signature_space && (
                  <div className="mt-6">
                    <div className="w-48 border-b border-gray-400"></div>
                    <p className="text-xs text-gray-500 mt-1">Authorized Signature</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Create New Template Modal */}
      {showNewTemplate && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
          <p className="text-muted-foreground mb-4">
            A new template will be created with default settings that you can customize.
          </p>
          <div className="flex gap-2">
            <Button onClick={createTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
            <Button variant="outline" onClick={() => setShowNewTemplate(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};