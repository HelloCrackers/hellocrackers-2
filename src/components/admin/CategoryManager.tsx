import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSupabase, Category } from "@/hooks/useSupabase";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export const CategoryManager = () => {
  const { fetchCategories } = useSupabase();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
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

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
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
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
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