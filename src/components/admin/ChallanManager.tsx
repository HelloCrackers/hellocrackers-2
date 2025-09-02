import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Palette, Settings, Eye, Edit } from "lucide-react";

export const ChallanManager = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Default Challan',
      isDefault: true,
      colors: { primary: '#ff6b35', secondary: '#ffa500' },
      layout: 'standard'
    },
    {
      id: 2,
      name: 'Premium Challan',
      isDefault: false,
      colors: { primary: '#6366f1', secondary: '#8b5cf6' },
      layout: 'modern'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Challan Templates</h2>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Templates</h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate.id === template.id 
                    ? 'border-brand-red bg-brand-red/5' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">Layout: {template.layout}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {template.isDefault && (
                      <Badge className="bg-green-100 text-green-800">Default</Badge>
                    )}
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Template Editor */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Template Editor</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input 
                value={selectedTemplate.name} 
                readOnly={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label>Layout Style</Label>
              <Select value={selectedTemplate.layout} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedTemplate.colors.primary}
                    disabled={!isEditing}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={selectedTemplate.colors.primary}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>

              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedTemplate.colors.secondary}
                    disabled={!isEditing}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={selectedTemplate.colors.secondary}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Challan Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Challan Preview
        </h3>
        
        <div className="border rounded-lg p-8 bg-white" style={{ 
          borderColor: selectedTemplate.colors.primary 
        }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src="/assets/hello-crackers-logo.jpg" 
                alt="Hello Crackers" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: selectedTemplate.colors.primary }}
                >
                  Hello Crackers
                </h1>
                <p className="text-sm text-gray-600">Premium Crackers Direct from Factory</p>
              </div>
            </div>
          </div>

          {/* Challan Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-semibold mb-2" style={{ color: selectedTemplate.colors.primary }}>
                Bill To:
              </h3>
              <p>Sample Customer Name</p>
              <p>sample@email.com</p>
              <p>+91 9876543210</p>
              <p>Sample Address, City - 123456</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2" style={{ color: selectedTemplate.colors.primary }}>
                Challan Details:
              </h3>
              <p><strong>Challan No:</strong> HC2024001</p>
              <p><strong>Order No:</strong> ORD2024001</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border mb-6">
            <thead>
              <tr style={{ backgroundColor: selectedTemplate.colors.primary + '20' }}>
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-center">Qty</th>
                <th className="border p-2 text-right">Rate</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Sample Cracker Product</td>
                <td className="border p-2 text-center">10</td>
                <td className="border p-2 text-right">₹50</td>
                <td className="border p-2 text-right">₹500</td>
              </tr>
              <tr>
                <td className="border p-2">Another Cracker Item</td>
                <td className="border p-2 text-center">5</td>
                <td className="border p-2 text-right">₹100</td>
                <td className="border p-2 text-right">₹500</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="text-right mb-6">
            <div className="inline-block">
              <div className="flex justify-between gap-8 mb-2">
                <span>Subtotal:</span>
                <span>₹1,000</span>
              </div>
              <div className="flex justify-between gap-8 mb-2">
                <span>Discount (90%):</span>
                <span>-₹900</span>
              </div>
              <div 
                className="flex justify-between gap-8 font-bold text-lg border-t pt-2"
                style={{ color: selectedTemplate.colors.primary }}
              >
                <span>Total:</span>
                <span>₹100</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            <p>Contact: 9042191018 | Email: hello@hellocrackers.com</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Set as Default
          </Button>
        </div>
      </Card>
    </div>
  );
};