import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, Plus, Edit, Trash2, Download, Upload, 
  FileText, Image, Settings, Copy, Eye
} from "lucide-react";

interface ChallanTemplate {
  id: string;
  name: string;
  template_data: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const ChallanTemplateManager = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<ChallanTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<ChallanTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    company: {
      name: 'Hello Crackers',
      logo: '',
      address: 'Your Company Address',
      phone: '+91 XXXXX XXXXX',
      email: 'hello@crackers.com',
      gst: 'GST NO: XXXXXXXXX'
    },
    header: {
      title: 'DELIVERY CHALLAN',
      subtitle: 'Tax Invoice'
    },
    customer: {
      nameLabel: 'Customer Name',
      addressLabel: 'Delivery Address',
      phoneLabel: 'Phone Number',
      emailLabel: 'Email Address'
    },
    product: {
      headers: ['Item Description', 'Quantity', 'Rate', 'Discount', 'Amount'],
      showDiscount: true,
      showTax: true
    },
    footer: {
      terms: 'Terms & Conditions:\n1. Goods once sold cannot be returned.\n2. Payment to be made within 7 days.\n3. Subject to jurisdiction only.',
      signature: 'Authorized Signatory',
      thankYou: 'Thank you for your business!'
    },
    transport: {
      showSection: true,
      vehicleLabel: 'Vehicle Number',
      driverLabel: 'Driver Name',
      deliveryLabel: 'Expected Delivery'
    },
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFE5B4',
      text: '#333333',
      background: '#FFFFFF'
    }
  });

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
    } catch (error) {
      toast({
        title: "Failed to load templates",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        name: formData.name,
        template_data: {
          company: formData.company,
          header: formData.header,
          customer: formData.customer,
          product: formData.product,
          footer: formData.footer,
          transport: formData.transport,
          colors: formData.colors
        },
        is_default: templates.length === 0 // First template becomes default
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('challan_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast({ title: "Template updated successfully" });
      } else {
        const { error } = await supabase
          .from('challan_templates')
          .insert([templateData]);

        if (error) throw error;
        toast({ title: "Template created successfully" });
      }

      await loadTemplates();
      resetForm();
    } catch (error) {
      toast({
        title: "Failed to save template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('challan_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Template deleted successfully" });
      await loadTemplates();
    } catch (error) {
      toast({
        title: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (template: ChallanTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      company: template.template_data.company,
      header: template.template_data.header,
      customer: template.template_data.customer,
      product: template.template_data.product,
      footer: template.template_data.footer,
      transport: template.template_data.transport,
      colors: template.template_data.colors
    });
    setShowEditor(true);
  };

  const handleClone = (template: ChallanTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      company: template.template_data.company,
      header: template.template_data.header,
      customer: template.template_data.customer,
      product: template.template_data.product,
      footer: template.template_data.footer,
      transport: template.template_data.transport,
      colors: template.template_data.colors
    });
    setShowEditor(true);
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('challan_templates')
        .update({ is_default: false })
        .neq('id', 'none');

      // Set the selected template as default
      const { error } = await supabase
        .from('challan_templates')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Default template updated" });
      await loadTemplates();
    } catch (error) {
      toast({
        title: "Failed to set default template",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setShowEditor(false);
    setFormData({
      name: '',
      company: {
        name: 'Hello Crackers',
        logo: '',
        address: 'Your Company Address',
        phone: '+91 XXXXX XXXXX',
        email: 'hello@crackers.com',
        gst: 'GST NO: XXXXXXXXX'
      },
      header: {
        title: 'DELIVERY CHALLAN',
        subtitle: 'Tax Invoice'
      },
      customer: {
        nameLabel: 'Customer Name',
        addressLabel: 'Delivery Address',
        phoneLabel: 'Phone Number',
        emailLabel: 'Email Address'
      },
      product: {
        headers: ['Item Description', 'Quantity', 'Rate', 'Discount', 'Amount'],
        showDiscount: true,
        showTax: true
      },
      footer: {
        terms: 'Terms & Conditions:\n1. Goods once sold cannot be returned.\n2. Payment to be made within 7 days.\n3. Subject to jurisdiction only.',
        signature: 'Authorized Signatory',
        thankYou: 'Thank you for your business!'
      },
      transport: {
        showSection: true,
        vehicleLabel: 'Vehicle Number',
        driverLabel: 'Driver Name',
        deliveryLabel: 'Expected Delivery'
      },
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFE5B4',
        text: '#333333',
        background: '#FFFFFF'
      }
    });
  };

  const generateSampleChallan = (template: ChallanTemplate) => {
    // This would generate a sample PDF using the template
    toast({ title: "Sample challan generated", description: "Check your downloads folder" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Challan Templates</h2>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {!showEditor ? (
        <div className="space-y-6">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      {template.is_default && (
                        <Badge className="mt-1">Default</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {Object.values(template.template_data.colors).slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color as string }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Company: {template.template_data.company.name}</p>
                    <p>Created: {new Date(template.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleClone(template)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => generateSampleChallan(template)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    {!template.is_default && (
                      <Button size="sm" variant="outline" onClick={() => handleSetDefault(template.id)}>
                        Set Default
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(template.id)}
                      disabled={template.is_default}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first challan template to get started.
              </p>
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Challan Title</Label>
                    <Input
                      id="title"
                      value={formData.header.title}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        header: { ...prev.header, title: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.header.subtitle}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        header: { ...prev.header, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.company.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        company: { ...prev.company, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gst">GST Number</Label>
                    <Input
                      id="gst"
                      value={formData.company.gst}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        company: { ...prev.company, gst: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.company.phone}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        company: { ...prev.company, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.company.email}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        company: { ...prev.company, email: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.company.address}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      company: { ...prev.company, address: e.target.value }
                    }))}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Transport Section</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        checked={formData.transport.showSection}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          transport: { ...prev.transport, showSection: e.target.checked }
                        }))}
                      />
                      <span className="text-sm">Show transport details</span>
                    </div>
                  </div>
                  <div>
                    <Label>Product Columns</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        checked={formData.product.showDiscount}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          product: { ...prev.product, showDiscount: e.target.checked }
                        }))}
                      />
                      <span className="text-sm">Show discount column</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.footer.terms}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      footer: { ...prev.footer, terms: e.target.value }
                    }))}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signature">Signature Label</Label>
                    <Input
                      id="signature"
                      value={formData.footer.signature}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        footer: { ...prev.footer, signature: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="thankYou">Thank You Message</Label>
                    <Input
                      id="thankYou"
                      value={formData.footer.thankYou}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        footer: { ...prev.footer, thankYou: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(formData.colors).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="capitalize">{key} Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, [key]: e.target.value }
                          }))}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={value}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, [key]: e.target.value }
                          }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};