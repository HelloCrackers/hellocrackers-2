import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase, Product } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, Upload, Download, FileText, Image, Video,
  Search, Filter, Save, X, Eye, RotateCcw
} from "lucide-react";
import { processZipFile, processExcelFile, exportToExcel, generateProductTemplate, validateImageFile } from "@/utils/fileProcessing";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

export const ProductManager = () => {
  const { fetchProducts, createProduct, updateProduct, deleteProduct, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category: '',
    description: '',
    content: '',
    user_for: 'Family' as 'Family' | 'Adult' | 'Kids',
    mrp: 0,
    discount: 0,
    final_rate: 0,
    stock: 0,
    image_url: '',
    video_url: '',
    status: 'active' as 'active' | 'inactive',
    featured: false
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [processingImages, setProcessingImages] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const resetForm = () => {
    setFormData({
      product_code: '',
      product_name: '',
      category: '',
      description: '',
      content: '',
      user_for: 'Family',
      mrp: 0,
      discount: 0,
      final_rate: 0,
      stock: 0,
      image_url: '',
      video_url: '',
      status: 'active',
      featured: false
    });
    setEditingProduct(null);
    setShowAddProduct(false);
    setImageFiles([]);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      product_code: product.product_code,
      product_name: product.product_name,
      category: product.category,
      description: product.description || '',
      content: product.content || '',
      user_for: product.user_for,
      mrp: product.mrp,
      discount: product.discount,
      final_rate: product.final_rate,
      stock: product.stock,
      image_url: product.image_url || '',
      video_url: product.video_url || '',
      status: product.status,
      featured: product.featured
    });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images if any
      if (imageFiles.length > 0) {
        const file = imageFiles[0];
        const fileName = `${formData.product_code}_${Date.now()}.${file.name.split('.').pop()}`;
        const uploadResult = await uploadFile('products', fileName, file);
        if (uploadResult.success && uploadResult.url) {
          formData.image_url = uploadResult.url;
        }
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct({
          ...formData,
          rating: 0,
          reviews_count: 0
        });
      }
      
      await loadProducts();
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await loadProducts();
    }
  };

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setProcessingImages(true);
    try {
      // If it's a ZIP file, process it
      if (files[0].name.endsWith('.zip')) {
        const processedFiles = await processZipFile(files[0], true); // Remove backgrounds
        
        for (const { file, processedBlob, error } of processedFiles) {
          if (error) {
            toast({
              title: "Processing Error",
              description: error,
              variant: "destructive"
            });
            continue;
          }

          const fileToUpload = processedBlob ? new File([processedBlob], file.name, { type: 'image/png' }) : file;
          const fileName = `bulk_${Date.now()}_${file.name}`;
          const imageUrl = await uploadFile('products', fileName, fileToUpload);
          
          if (imageUrl) {
            toast({
              title: "Image Uploaded",
              description: `Successfully uploaded ${file.name}`,
            });
          }
        }
      } else {
        // Process individual image files
        for (const file of files) {
          if (!validateImageFile(file)) {
            toast({
              title: "Invalid File",
              description: `${file.name} is not a valid image file`,
              variant: "destructive"
            });
            continue;
          }

          try {
            // Remove background
            const img = await loadImage(file);
            const processedBlob = await removeBackground(img);
            const processedFile = new File([processedBlob], file.name, { type: 'image/png' });
            
            const fileName = `processed_${Date.now()}_${file.name}`;
            const imageUrl = await uploadFile('products', fileName, processedFile);
            
            if (imageUrl) {
              toast({
                title: "Image Processed",
                description: `Background removed and uploaded: ${file.name}`,
              });
            }
          } catch (error) {
            toast({
              title: "Processing Failed",
              description: `Failed to process ${file.name}`,
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process bulk upload",
        variant: "destructive"
      });
    } finally {
      setProcessingImages(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const productData = await processExcelFile(file);
      
      for (const product of productData) {
        await createProduct({
          product_code: product.productCode,
          product_name: product.productName,
          category: product.category,
          description: product.description,
          content: product.content,
          user_for: product.userFor,
          mrp: product.mrp,
          discount: product.discount,
          final_rate: product.finalRate,
          stock: product.stock,
          image_url: '',
          video_url: '',
          rating: 0,
          reviews_count: 0,
          status: 'active',
          featured: false
        });
      }
      
      await loadProducts();
      toast({
        title: "Bulk Upload Complete",
        description: `Successfully uploaded ${productData.length} products`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process Excel file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = products.map(product => ({
      'Product Code': product.product_code,
      'Product Name': product.product_name,
      'Category': product.category,
      'User For': product.user_for,
      'MRP': product.mrp,
      'Discount %': product.discount,
      'Final Rate': product.final_rate,
      'Stock': product.stock,
      'Description': product.description || '',
      'Content': product.content || '',
      'Status': product.status,
      'Featured': product.featured,
      'Rating': product.rating,
      'Reviews': product.reviews_count
    }));
    
    exportToExcel(exportData, 'products_export', 'Products');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateProductTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="image-tools">Image Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Product List */}
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Image</th>
                    <th className="text-left p-4">Product Details</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Pricing</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-4">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.product_name}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{product.product_name}</p>
                          <p className="text-sm text-muted-foreground">{product.product_code}</p>
                          <Badge variant="outline">{product.user_for}</Badge>
                        </div>
                      </td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">
                        <div>
                          <span className="text-gray-500 line-through">₹{product.mrp}</span>
                          <p className="font-bold text-brand-red">₹{product.final_rate}</p>
                          <Badge className="bg-brand-orange text-white text-xs">
                            {product.discount}% OFF
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <Badge 
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                          className={product.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Excel Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Excel Bulk Upload</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload product details via Excel file. Download the template first.
              </p>
              <div className="space-y-4">
                <Button variant="outline" onClick={generateProductTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <div>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    disabled={loading}
                  />
                </div>
              </div>
            </Card>

            {/* Image/Video Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Bulk Image Upload</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload multiple images or ZIP files. Background removal is automatic.
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Upload Images or ZIP</Label>
                  <Input
                    type="file"
                    accept="image/*,.zip"
                    multiple
                    onChange={handleBulkImageUpload}
                    disabled={processingImages}
                  />
                </div>
                {processingImages && (
                  <div className="text-sm text-muted-foreground">
                    Processing images... This may take a moment.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="image-tools" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Image Processing Tools</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Advanced image processing tools for product images.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Background Removal</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically remove backgrounds from product images
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Batch Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Process multiple images at once via ZIP uploads
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Video Support</h4>
                <p className="text-sm text-muted-foreground">
                  Upload and manage product videos
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="product_code">Product Code</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, product_code: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_for">User For</Label>
                    <Select 
                      value={formData.user_for} 
                      onValueChange={(value: 'Family' | 'Adult' | 'Kids') => 
                        setFormData(prev => ({ ...prev, user_for: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Adult">Adult</SelectItem>
                        <SelectItem value="Kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mrp">MRP (₹)</Label>
                    <Input
                      id="mrp"
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData(prev => ({ ...prev, mrp: Number(e.target.value) }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="final_rate">Final Rate (₹)</Label>
                    <Input
                      id="final_rate"
                      type="number"
                      value={formData.final_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, final_rate: Number(e.target.value) }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="e.g., Pack of 5, Single piece"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles(files);
                    }}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Product'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};