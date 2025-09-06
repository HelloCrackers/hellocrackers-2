import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabase, Product } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { processZipFile, processExcelFile, exportToExcel, generateProductTemplate } from "@/utils/fileProcessing";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import { 
  Upload, Download, Package, Edit, Trash2, Save, X, 
  FileSpreadsheet, Archive, Image as ImageIcon, Video,
  Plus, Eye, CheckSquare, Square, MoreHorizontal
} from "lucide-react";

export const ImprovedProductManager = () => {
  const { fetchProducts, createProduct, updateProduct, deleteProduct, uploadFile } = useSupabase();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [editingProducts, setEditingProducts] = useState<Set<string>>(new Set());
  const [bulkUploadStatus, setBulkUploadStatus] = useState<{
    success: number;
    failed: number;
    processing: boolean;
    logs: string[];
  }>({ success: 0, failed: 0, processing: false, logs: [] });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleEditProduct = (productId: string) => {
    const newEditing = new Set(editingProducts);
    if (newEditing.has(productId)) {
      newEditing.delete(productId);
    } else {
      newEditing.add(productId);
    }
    setEditingProducts(newEditing);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      toast({ title: "No products selected", variant: "destructive" });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const productId of selectedProducts) {
      try {
        await deleteProduct(productId);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    toast({
      title: "Bulk Delete Complete",
      description: `${successCount} deleted, ${failCount} failed`,
    });

    setSelectedProducts(new Set());
    await loadProducts();
  };

  const handleProductUpdate = async (productId: string, updates: Partial<Product>) => {
    try {
      await updateProduct(productId, updates);
      await loadProducts();
    } catch (error) {
      toast({ title: "Failed to update product", variant: "destructive" });
    }
  };

  const handleBulkZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.zip')) {
      toast({ title: "Please select a ZIP file", variant: "destructive" });
      return;
    }

    setBulkProcessing(true);
    setBulkUploadStatus({ success: 0, failed: 0, processing: true, logs: [] });

    try {
      const productCodes = products.map(p => p.product_code);
      const result = await processZipFile(file, productCodes, true);
      
      let successCount = 0;
      let errorCount = 0;
      const logs: string[] = [];

      for (const processedFile of result.processedFiles) {
        try {
          const fileToUpload = processedFile.processedBlob 
            ? new File([processedFile.processedBlob], processedFile.file.name, { type: 'image/png' })
            : processedFile.file;

          const { success } = await uploadFile('products', `bulk/${Date.now()}_${fileToUpload.name}`, fileToUpload);
          if (success) {
            successCount++;
            logs.push(`✅ ${fileToUpload.name} uploaded successfully`);
          } else {
            errorCount++;
            logs.push(`❌ ${fileToUpload.name} upload failed`);
          }
        } catch (error) {
          errorCount++;
          logs.push(`❌ ${processedFile.file.name} upload error: ${error}`);
        }
      }

      setBulkUploadStatus({ success: successCount, failed: errorCount, processing: false, logs });
      toast({ 
        title: "Bulk upload completed", 
        description: `${successCount} files uploaded, ${errorCount} failed` 
      });
    } catch (error) {
      setBulkUploadStatus(prev => ({ ...prev, processing: false, logs: [...prev.logs, `❌ ZIP processing failed: ${error}`] }));
      toast({ title: "Failed to process ZIP file", variant: "destructive" });
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkProcessing(true);
    setBulkUploadStatus({ success: 0, failed: 0, processing: true, logs: [] });

    try {
      const result = await processExcelFile(file);
      
      let successCount = 0;
      let errorCount = 0;
      const logs: string[] = [];

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
          logs.push(`✅ ${product.productCode} created successfully`);
        } catch (error) {
          errorCount++;
          logs.push(`❌ ${product.productCode} creation failed: ${error}`);
        }
      }

      setBulkUploadStatus({ success: successCount, failed: errorCount, processing: false, logs });
      await loadProducts();
      toast({ 
        title: "Excel import completed", 
        description: `${successCount} products created, ${errorCount} failed` 
      });
    } catch (error) {
      setBulkUploadStatus(prev => ({ ...prev, processing: false, logs: [...prev.logs, `❌ Excel processing failed: ${error}`] }));
      toast({ title: "Failed to process Excel file", variant: "destructive" });
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage products with advanced bulk operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateProductTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => {
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
          }}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Products
          </Button>
        </div>
      </div>

      {/* Bulk Upload Section - Moved to Top */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Upload ZIP File (Images/Videos)</Label>
            <Input
              type="file"
              accept=".zip"
              onChange={handleBulkZipUpload}
              disabled={bulkProcessing}
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload Excel File (Product Data)</Label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              disabled={bulkProcessing}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        {/* Bulk Upload Status */}
        {(bulkUploadStatus.processing || bulkUploadStatus.logs.length > 0) && (
          <Card className="p-4 bg-muted">
            <h4 className="font-medium mb-2">Upload Status</h4>
            {bulkUploadStatus.processing && (
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Processing files...</span>
              </div>
            )}
            <div className="flex gap-4 text-sm mb-2">
              <span className="text-green-600">✅ Success: {bulkUploadStatus.success}</span>
              <span className="text-red-600">❌ Failed: {bulkUploadStatus.failed}</span>
            </div>
            {bulkUploadStatus.logs.length > 0 && (
              <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                {bulkUploadStatus.logs.map((log, index) => (
                  <div key={index} className="font-mono">{log}</div>
                ))}
              </div>
            )}
          </Card>
        )}
      </Card>

      {/* Products List with Selection */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Products ({products.length})</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedProducts.size === products.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                Select All
              </Button>
              {selectedProducts.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete Selected ({selectedProducts.size})
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.sort((a, b) => a.product_code.localeCompare(b.product_code)).map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <Checkbox
                  checked={selectedProducts.has(product.id)}
                  onCheckedChange={() => toggleSelectProduct(product.id)}
                  className="mt-1"
                />

                {/* Product Image */}
                {product.image_url && (
                  <img src={product.image_url} alt={product.product_name} className="w-16 h-16 object-cover rounded" />
                )}

                {/* Product Details */}
                <div className="flex-1">
                  {editingProducts.has(product.id) ? (
                    <EditableProductRow 
                      product={product}
                      onSave={(updates) => {
                        handleProductUpdate(product.id, updates);
                        toggleEditProduct(product.id);
                      }}
                      onCancel={() => toggleEditProduct(product.id)}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <p className="font-semibold">{product.product_name}</p>
                        <p className="text-sm text-muted-foreground">Code: {product.product_code}</p>
                      </div>
                      <div>
                        <p className="text-sm">Category: {product.category}</p>
                        <p className="text-sm">User: {product.user_for}</p>
                      </div>
                      <div>
                        <p className="text-sm">MRP: ₹{product.mrp}</p>
                        <p className="text-sm text-green-600">Final: ₹{product.final_rate}</p>
                      </div>
                      <div>
                        <p className="text-sm">Stock: {product.stock}</p>
                        <p className="text-sm">Discount: {product.discount}%</p>
                      </div>
                      <div>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleEditProduct(product.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product.id).then(() => loadProducts());
                          }
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found. Upload products to get started.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

// Inline Editable Product Row Component
const EditableProductRow = ({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Product;
  onSave: (updates: Partial<Product>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    product_name: product.product_name,
    mrp: product.mrp,
    discount: product.discount,
    final_rate: product.final_rate,
    stock: product.stock,
    description: product.description || '',
    status: product.status
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
      <div>
        <Label>Product Name</Label>
        <Input
          value={formData.product_name}
          onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
          className="h-8"
        />
      </div>
      <div>
        <Label>MRP (₹)</Label>
        <Input
          type="number"
          value={formData.mrp}
          onChange={(e) => setFormData(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
          className="h-8"
        />
      </div>
      <div>
        <Label>Discount (%)</Label>
        <Input
          type="number"
          value={formData.discount}
          onChange={(e) => {
            const discount = parseInt(e.target.value) || 0;
            const final_rate = formData.mrp * (1 - discount / 100);
            setFormData(prev => ({ ...prev, discount, final_rate }));
          }}
          className="h-8"
        />
      </div>
      <div>
        <Label>Stock</Label>
        <Input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
          className="h-8"
        />
      </div>
      <div>
        <Label>Status</Label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
          className="h-8 w-full border rounded px-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};