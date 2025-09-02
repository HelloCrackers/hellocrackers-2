import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase, Category } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

export const CategoryManager = () => {
  const { fetchCategories, createCategory, updateCategory, deleteCategory, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    display_order: 0,
    image_url: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { success, url } = await uploadFile('content', `categories/${Date.now()}_${file.name}`, file);
        if (success && url) {
          setFormData(prev => ({ ...prev, image_url: url }));
          toast({ title: "Image uploaded successfully" });
        }
      } catch (error) {
        toast({ title: "Failed to upload image", variant: "destructive" });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast({ title: "Category updated successfully" });
        setEditingCategory(null);
      } else {
        await createCategory(formData);
        toast({ title: "Category created successfully" });
        setShowAddCategory(false);
      }
      
      setFormData({ name: '', description: '', status: 'active', display_order: 0, image_url: '' });
      await loadCategories();
    } catch (error) {
      toast({ title: "Failed to save category", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast({ title: "Category deleted successfully" });
        await loadCategories();
      } catch (error) {
        toast({ title: "Failed to delete category", variant: "destructive" });
      }
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status as 'active' | 'inactive',
      display_order: category.display_order || 0,
      image_url: category.image_url || ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={() => setShowAddCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddCategory || editingCategory) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingCategory ? 'Update' : 'Create'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddCategory(false);
                setEditingCategory(null);
                setFormData({ name: '', description: '', status: 'active', display_order: 0, image_url: '' });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            {category.image_url && (
              <img src={category.image_url} alt={category.name} className="w-full h-32 object-cover rounded mb-4" />
            )}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <Badge 
                variant={category.status === 'active' ? 'default' : 'secondary'}
                className={category.status === 'active' ? 'bg-green-100 text-green-800' : ''}
              >
                {category.status}
              </Badge>
            </div>
            
            {category.description && (
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Order: {category.display_order}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(category)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
        </Card>
      )}
    </div>
  );
};