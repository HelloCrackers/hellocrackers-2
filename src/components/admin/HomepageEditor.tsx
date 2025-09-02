import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupabase, HomepageContent } from "@/hooks/useSupabase";
import { Save, Edit, Image, FileText } from "lucide-react";

export const HomepageEditor = () => {
  const { fetchHomepageContent, updateHomepageContent } = useSupabase();
  
  const [content, setContent] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchHomepageContent();
    setContent(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Homepage Content Management</h2>
        <p className="text-muted-foreground">Edit homepage sections directly</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {content.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {section.section_name.replace('_', ' ')}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingSection(section.section_name)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(section.content, null, 2)}
              </pre>
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder for future homepage editor */}
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Edit className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold">Visual Homepage Editor</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            A drag-and-drop visual editor for homepage content will be available here. 
            You can edit hero sections, features, galleries, and more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Hero Section</h4>
              <p className="text-sm text-muted-foreground">Edit main banner, title, and call-to-action</p>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Product Gallery</h4>
              <p className="text-sm text-muted-foreground">Manage featured products and images</p>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Footer Content</h4>
              <p className="text-sm text-muted-foreground">Update company info and links</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};