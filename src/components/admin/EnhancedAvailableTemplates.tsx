import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, Edit, Download, Trash2, Star, StarOff, Search, Filter,
  Receipt, Calendar, MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Template {
  id: string;
  name: string;
  type: 'challan';
  is_default: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  template_data: any;
}

interface Props {
  onEditTemplate?: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void;
  onCreateNew?: () => void;
}

export const EnhancedAvailableTemplates = ({ onEditTemplate, onPreviewTemplate, onCreateNew }: Props) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "updated" | "name">("created");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data: challanData, error: challanError } = await supabase
        .from('challan_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (challanError) throw challanError;

      const allTemplates: Template[] = (challanData || []).map(t => ({ ...t, type: 'challan' as const }));
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (template: Template) => {
    try {
      // First, unset all defaults for challan templates
      await supabase
        .from('challan_templates')
        .update({ is_default: false })
        .neq('id', 'none');

      // Set the selected template as default
      const { error } = await supabase
        .from('challan_templates')
        .update({ is_default: true })
        .eq('id', template.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Set as default ${template.type} template`,
      });
      
      loadTemplates();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to set default template",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (template: Template) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('challan_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      
      loadTemplates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template", 
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (template: Template) => {
    toast({
      title: "Generating PDF",
      description: "Preparing template for download...",
    });
    // Implement PDF generation and download
  };

  const filteredAndSortedTemplates = templates
    .filter(template => template.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "created":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Templates</h2>
        <Button onClick={() => onCreateNew?.()} variant="outline">
          <Receipt className="h-4 w-4 mr-2" />
          New Challan Template
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted relative">
              {template.thumbnail_url ? (
                <img 
                  src={template.thumbnail_url} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Receipt className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Type Badge */}
              <Badge 
                variant="default"
                className="absolute top-2 left-2"
              >
                Challan
              </Badge>

              {/* Default Badge */}
              {template.is_default && (
                <Badge variant="outline" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Default
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm truncate flex-1">{template.name}</h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPreviewTemplate?.(template)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditTemplate?.(template)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetDefault(template)}>
                      {template.is_default ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Remove Default
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Set Default
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(template)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(template)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Created: {new Date(template.created_at).toLocaleDateString()}</p>
                <p>Updated: {new Date(template.updated_at).toLocaleDateString()}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onPreviewTemplate?.(template)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEditTemplate?.(template)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAndSortedTemplates.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Try adjusting your search criteria"
                : "Create your first template to get started"}
            </p>
            <Button onClick={() => onCreateNew?.()} variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              New Challan Template
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};