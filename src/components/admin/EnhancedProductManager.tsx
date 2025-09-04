import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSupabase, Product } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { processZipFile, processExcelFile, ProductData, exportToExcel, generateProductTemplate, generateErrorLog, ProcessResult, MediaProcessResult } from "@/utils/fileProcessing";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import { 
  Upload, Download, Package, Edit, Trash2, Save, X, 
  FileSpreadsheet, Archive, Image as ImageIcon, Video,
  Plus, Eye
} from "lucide-react";

export const EnhancedProductManager = () => {
  const { fetchProducts, createProduct, updateProduct, deleteProduct, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category: '',
    user_for: 'Family' as 'Family' | 'Adult' | 'Kids',
    mrp: 0,
    discount: 0,
    final_rate: 0,
    stock: 0,
    description: '',
    content: '',
    image_url: '',
    video_url: '',
    status: 'active'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, removeBack = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let finalFile = file;
      
      if (removeBack && file.type.startsWith('image/')) {
        toast({ title: "Processing image...", description: "Removing background" });
        const img = await loadImage(file);
        const processedBlob = await removeBackground(img);
        finalFile = new File([processedBlob], file.name, { type: 'image/png' });
      }

      const { success, url } = await uploadFile('products', `${Date.now()}_${finalFile.name}`, finalFile);
      if (success && url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        toast({ title: "Image uploaded successfully" });
      }
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { success, url } = await uploadFile('products', `videos/${Date.now()}_${file.name}`, file);
      if (success && url) {
        setFormData(prev => ({ ...prev, video_url: url }));
        toast({ title: "Video uploaded successfully" });
      }
    } catch (error) {
      toast({ title: "Failed to upload video", variant: "destructive" });
    }
  };

  const handleBulkZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.zip')) {
      toast({ title: "Please select a ZIP file", variant: "destructive" });
      return;
    }

    setBulkProcessing(true);
    try {
      toast({ title: "Processing ZIP file...", description: "This may take a few minutes" });
      
      const productCodes = products.map(p => p.product_code);
      const result = await processZipFile(file, productCodes, true); // Remove backgrounds
      
      if (!result.success) {
        generateErrorLog(result.errors, [], `zip_upload_errors_${Date.now()}`);
        toast({ 
          title: "Upload failed with errors", 
          description: `${result.unmappedCount} folders don't match product codes. Error log downloaded.`,
          variant: "destructive" 
        });
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;

      for (const processedFile of result.processedFiles) {
        try {
          const fileToUpload = processedFile.processedBlob 
            ? new File([processedFile.processedBlob], processedFile.file.name, { type: 'image/png' })
            : processedFile.file;

          const { success } = await uploadFile('products', `bulk/${Date.now()}_${fileToUpload.name}`, fileToUpload);
          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${processedFile.file.name}:`, error);
        }
      }

      toast({ 
        title: "Bulk upload completed", 
        description: `${successCount} files uploaded successfully, ${errorCount} failed` 
      });
    } catch (error) {
      toast({ title: "Failed to process ZIP file", variant: "destructive" });
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkProcessing(true);
    try {
      toast({ title: "Processing Excel file...", description: "Reading product data" });
      
      const result = await processExcelFile(file);
      
      if (!result.success) {
        generateErrorLog(result.errors, [], `excel_upload_errors_${Date.now()}`);
        toast({ 
          title: "Upload failed with errors", 
          description: `${result.errorCount} errors found. Error log downloaded.`,
          variant: "destructive" 
        });
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;

      for (const product of result.data || []) {
        try {
          await createProduct({
            product_code: product.productCode,
            product_name: product.productName,
            category: product.category,
            user_for: product.userFor,
            mrp: product.mrp,
            discount: product.discount,
            final_rate: product.finalRate,
            stock: product.stock,
            description: product.description || '',
            content: product.content || '',
            status: 'active' as const,
            rating: 0,
            reviews_count: 0,
            featured: false
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to create product ${product.productCode}:`, error);
        }
      }

      await loadProducts();
      toast({ 
        title: "Excel import completed", 
        description: `${successCount} products created, ${errorCount} failed` 
      });
    } catch (error) {
      toast({ title: "Failed to process Excel file", variant: "destructive" });
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.product_name.trim() || !formData.product_code.trim()) {
      toast({ title: "Product name and code are required", variant: "destructive" });
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...formData,
          status: formData.status as 'active' | 'inactive'
        });
        toast({ title: "Product updated successfully" });
        setEditingProduct(null);
      } else {
        await createProduct({
          ...formData,
          status: formData.status as 'active' | 'inactive',
          rating: 0,
          reviews_count: 0,
          featured: false
        });
        toast({ title: "Product created successfully" });
        setShowAddProduct(false);
      }
      
      resetForm();
      await loadProducts();
    } catch (error) {
      toast({ title: "Failed to save product", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast({ title: "Product deleted successfully" });
        await loadProducts();
      } catch (error) {
        toast({ title: "Failed to delete product", variant: "destructive" });
      }
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_code: product.product_code,
      product_name: product.product_name,
      category: product.category,
      user_for: product.user_for as 'Family' | 'Adult' | 'Kids',
      mrp: product.mrp,
      discount: product.discount,
      final_rate: product.final_rate,
      stock: product.stock,
      description: product.description || '',
      content: product.content || '',
      image_url: product.image_url || '',
      video_url: product.video_url || '',
      status: product.status
    });
  };

  const resetForm = () => {
    setFormData({
      product_code: '',
      product_name: '',
      category: '',
      user_for: 'Family',
      mrp: 0,
      discount: 0,
      final_rate: 0,
      stock: 0,
      description: '',
      content: '',
      image_url: '',
      video_url: '',
      status: 'active'
    });
  };

  const exportProducts = () => {
    const exportData = products.map(product => ({
      'Product Code': product.product_code,
      'Product Name': product.product_name,
      'Category': product.category,
      'User For': product.user_for,
      'MRP': product.mrp,
      'Discount %': product.discount,
      'Final Rate': product.final_rate,
      'Stock': product.stock,
      'Description': product.description,
      'Content': product.content,
      'Status': product.status
    }));
    
    exportToExcel(exportData, 'products_export', 'Products');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Product Management</h2>
          <p className="text-muted-foreground">Manage products with bulk upload and background removal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateProductTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={exportProducts}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Products
          </Button>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Upload ZIP File (Images/Videos)</Label>
            <div className="relative">
              <Input
                type="file"
                accept=".zip"
                onChange={handleBulkZipUpload}
                disabled={bulkProcessing}
                className="cursor-pointer"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Archive className="h-4 w-4" />
                <span>Supports images and videos with automatic background removal</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Upload Excel File (Product Data)</Label>
            <div className="relative">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                disabled={bulkProcessing}
                className="cursor-pointer"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Bulk import product details from Excel</span>
              </div>
            </div>
          </div>
        </div>
        
        {bulkProcessing && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Processing files...</span>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Form */}
      {(showAddProduct || editingProduct) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Product Code</Label>
              <Input
                value={formData.product_code}
                onChange={(e) => setFormData(prev => ({ ...prev, product_code: e.target.value }))}
                placeholder="Enter product code"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={formData.product_name}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category"
              />
            </div>
            
            <div className="space-y-2">
              <Label>User For</Label>
              <select
                value={formData.user_for}
                onChange={(e) => setFormData(prev => ({ ...prev, user_for: e.target.value as 'Family' | 'Adult' | 'Kids' }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="Family">Family</option>
                <option value="Adult">Adult</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>MRP (₹)</Label>
              <Input
                type="number"
                value={formData.mrp}
                onChange={(e) => setFormData(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) => {
                  const discount = parseInt(e.target.value) || 0;
                  const final_rate = formData.mrp * (1 - discount / 100);
                  setFormData(prev => ({ ...prev, discount, final_rate }));
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Final Rate (₹)</Label>
              <Input
                type="number"
                value={formData.final_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, final_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleImageUpload(e as any, true);
                    input.click();
                  }}
                >
                  Remove BG
                </Button>
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Product Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
              {formData.video_url && (
                <video src={formData.video_url} className="w-32 h-24 object-cover rounded" controls />
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {editingProduct ? 'Update' : 'Create'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
                resetForm();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Products List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Products ({products.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              {product.image_url && (
                <img src={product.image_url} alt={product.product_name} className="w-full h-32 object-cover rounded mb-4" />
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{product.product_name}</h4>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Code: {product.product_code}</p>
                <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">MRP: ₹{product.mrp}</p>
                    <p className="text-sm font-semibold text-green-600">Final: ₹{product.final_rate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Stock: {product.stock}</p>
                    <p className="text-sm">Discount: {product.discount}%</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
          </div>
        )}
      </Card>
    </div>
  );
};