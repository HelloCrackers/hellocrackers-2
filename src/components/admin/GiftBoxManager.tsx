import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Edit2, X, Gift } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

interface GiftBox {
  id: string;
  title: string;
  price: number;
  original_price: number;
  final_rate: number;
  discount: number;
  image_url: string | null;
  description: string | null;
  features: string[];
  badge: string | null;
  badge_color: string;
  display_order: number;
  status: string;
}

export const GiftBoxManager = () => {
  const { supabase } = useSupabase();
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    original_price: "",
    image_url: "",
    description: "",
    features: "",
    badge: "",
    badge_color: "bg-brand-gold text-black",
    display_order: "0",
    status: "active"
  });

  const badgeColorOptions = [
    { value: "bg-brand-gold text-black", label: "Gold" },
    { value: "bg-brand-red text-white", label: "Red" },
    { value: "bg-brand-purple text-white", label: "Purple" },
    { value: "bg-brand-orange text-white", label: "Orange" },
    { value: "bg-green-600 text-white", label: "Green" },
    { value: "bg-blue-600 text-white", label: "Blue" }
  ];

  useEffect(() => {
    fetchGiftBoxes();
  }, []);

  const fetchGiftBoxes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gift_boxes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Transform the data to ensure features is properly typed
      const transformedData = (data || []).map(item => ({
        ...item,
        features: Array.isArray(item.features) ? item.features.filter(f => typeof f === 'string') : []
      })) as GiftBox[];
      
      setGiftBoxes(transformedData);
    } catch (error) {
      console.error('Error fetching gift boxes:', error);
      toast.error('Failed to fetch gift boxes');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalRate = (price: number) => {
    return Math.round(price);
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round((1 - price / originalPrice) * 100);
  };

  const handleSave = async (id?: string) => {
    try {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.original_price);
      
      if (price >= originalPrice) {
        toast.error('Price must be less than original price');
        return;
      }

      const features = formData.features.split(',').map(f => f.trim()).filter(f => f);
      
      const giftBoxData = {
        title: formData.title,
        price: price,
        original_price: originalPrice,
        image_url: formData.image_url || null,
        description: formData.description || null,
        features: features,
        badge: formData.badge || null,
        badge_color: formData.badge_color,
        display_order: parseInt(formData.display_order),
        status: formData.status
      };

      if (id) {
        // Update existing
        const { error } = await supabase
          .from('gift_boxes')
          .update(giftBoxData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Gift box updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('gift_boxes')
          .insert([giftBoxData]);

        if (error) throw error;
        toast.success('Gift box created successfully');
      }

      setEditingId(null);
      setShowAddForm(false);
      resetForm();
      fetchGiftBoxes();
    } catch (error) {
      console.error('Error saving gift box:', error);
      toast.error('Failed to save gift box');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift box?')) return;

    try {
      const { error } = await supabase
        .from('gift_boxes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Gift box deleted successfully');
      fetchGiftBoxes();
    } catch (error) {
      console.error('Error deleting gift box:', error);
      toast.error('Failed to delete gift box');
    }
  };

  const startEdit = (giftBox: GiftBox) => {
    setFormData({
      title: giftBox.title,
      price: giftBox.price.toString(),
      original_price: giftBox.original_price.toString(),
      image_url: giftBox.image_url || "",
      description: giftBox.description || "",
      features: giftBox.features.join(', '),
      badge: giftBox.badge || "",
      badge_color: giftBox.badge_color,
      display_order: giftBox.display_order.toString(),
      status: giftBox.status
    });
    setEditingId(giftBox.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      original_price: "",
      image_url: "",
      description: "",
      features: "",
      badge: "",
      badge_color: "bg-brand-gold text-black",
      display_order: "0",
      status: "active"
    });
  };

  const handlePriceChange = (field: 'price' | 'original_price', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 text-brand-orange" />
            Festival Gift Box Manager
          </h2>
          <p className="text-muted-foreground">Manage homepage gift box offers with auto-calculated final rates</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-gradient-festive">
          <Plus className="h-4 w-4 mr-2" />
          Add Gift Box
        </Button>
      </div>

      {/* Add New Gift Box Form */}
      {showAddForm && (
        <Card className="border-2 border-brand-orange/20">
          <CardHeader>
            <CardTitle className="text-lg">Add New Gift Box</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., ₹1,000 Gift Box"
                />
              </div>

              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g., Popular, Best Value"
                />
              </div>

              <div>
                <Label htmlFor="price">Price * (Auto calculates final rate)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handlePriceChange('price', e.target.value)}
                  placeholder="1000"
                />
                {formData.price && formData.original_price && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Final Rate: ₹{calculateFinalRate(parseFloat(formData.price))} | 
                    Discount: {calculateDiscount(parseFloat(formData.price), parseFloat(formData.original_price))}%
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="original_price">Original Price *</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => handlePriceChange('original_price', e.target.value)}
                  placeholder="2500"
                />
              </div>

              <div>
                <Label htmlFor="badge_color">Badge Color</Label>
                <Select value={formData.badge_color} onValueChange={(value) => setFormData(prev => ({ ...prev, badge_color: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {badgeColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${option.value}`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="/src/assets/gift-box-1000.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Perfect starter pack for small celebrations"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="Family-friendly crackers, Sparklers included, Safe for kids"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => handleSave()} className="bg-gradient-festive">
                <Save className="h-4 w-4 mr-2" />
                Save Gift Box
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gift Boxes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading gift boxes...</div>
        ) : giftBoxes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No gift boxes found. Add your first gift box to get started.
          </div>
        ) : (
          giftBoxes.map((giftBox) => (
            <Card key={giftBox.id} className="overflow-hidden">
              {editingId === giftBox.id ? (
                // Edit Form
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${giftBox.id}`}>Title *</Label>
                      <Input
                        id={`title-${giftBox.id}`}
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`badge-${giftBox.id}`}>Badge</Label>
                      <Input
                        id={`badge-${giftBox.id}`}
                        value={formData.badge}
                        onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`price-${giftBox.id}`}>Price * (Auto calculates final rate)</Label>
                      <Input
                        id={`price-${giftBox.id}`}
                        type="number"
                        value={formData.price}
                        onChange={(e) => handlePriceChange('price', e.target.value)}
                      />
                      {formData.price && formData.original_price && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Final Rate: ₹{calculateFinalRate(parseFloat(formData.price))} | 
                          Discount: {calculateDiscount(parseFloat(formData.price), parseFloat(formData.original_price))}%
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`original_price-${giftBox.id}`}>Original Price *</Label>
                      <Input
                        id={`original_price-${giftBox.id}`}
                        type="number"
                        value={formData.original_price}
                        onChange={(e) => handlePriceChange('original_price', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`badge_color-${giftBox.id}`}>Badge Color</Label>
                      <Select value={formData.badge_color} onValueChange={(value) => setFormData(prev => ({ ...prev, badge_color: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {badgeColorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${option.value}`}></div>
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`display_order-${giftBox.id}`}>Display Order</Label>
                      <Input
                        id={`display_order-${giftBox.id}`}
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor={`image_url-${giftBox.id}`}>Image URL</Label>
                      <Input
                        id={`image_url-${giftBox.id}`}
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor={`description-${giftBox.id}`}>Description</Label>
                      <Textarea
                        id={`description-${giftBox.id}`}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor={`features-${giftBox.id}`}>Features (comma separated)</Label>
                      <Textarea
                        id={`features-${giftBox.id}`}
                        value={formData.features}
                        onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`status-${giftBox.id}`}>Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={() => handleSave(giftBox.id)} className="bg-gradient-festive">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              ) : (
                // Display Mode
                <div className="flex">
                  {giftBox.image_url && (
                    <div className="w-48 h-32 flex-shrink-0">
                      <img 
                        src={giftBox.image_url} 
                        alt={giftBox.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{giftBox.title}</h3>
                          {giftBox.badge && (
                            <Badge className={giftBox.badge_color}>
                              {giftBox.badge}
                            </Badge>
                          )}
                          <Badge variant={giftBox.status === 'active' ? 'default' : 'secondary'}>
                            {giftBox.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-2xl font-bold text-brand-red">₹{giftBox.final_rate.toLocaleString()}</span>
                          <span className="text-lg text-muted-foreground line-through">₹{giftBox.original_price.toLocaleString()}</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {giftBox.discount}% OFF
                          </Badge>
                        </div>

                        {giftBox.description && (
                          <p className="text-muted-foreground mb-2">{giftBox.description}</p>
                        )}

                        {giftBox.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {giftBox.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => startEdit(giftBox)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(giftBox.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};