import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Play, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, Product } from "@/hooks/useSupabase";
import { exportToExcel } from "@/utils/fileProcessing";
import helloCrackersBranded from "@/assets/hello-crackers-branded.png";


const PriceList = () => {
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { fetchProducts } = useSupabase();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Failed to load products",
        description: "Please refresh the page to try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products by Product Code in ascending order
  const filteredData = products
    .filter(product => 
      product.status === 'active' &&
      (product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.product_code.localeCompare(b.product_code));

  const handleQuantityChange = (code: string, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setQuantities(prev => ({
        ...prev,
        [code]: value
      }));
    }
  };

  const handleAddToCart = (product: Product) => {
    const qty = parseInt(quantities[product.product_code] || "1");
    if (qty > 0) {
      addToCart({
        productCode: product.product_code,
        productName: product.product_name,
        finalRate: product.final_rate,
        image: product.image_url || helloCrackersBranded,
        userFor: product.user_for
      }, qty);
      
      // Reset quantity input
      setQuantities(prev => ({
        ...prev,
        [product.product_code]: ""
      }));
      
      // Remove toast notification for added products
    }
  };

  const exportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  const handleExportToExcel = () => {
    try {
      const exportData = filteredData.map(product => ({
        'Product Code': product.product_code,
        'Product Name': product.product_name,
        'Category': product.category,
        'User For': product.user_for,
        'Content': product.content || '',
        'MRP (₹)': product.mrp,
        'Discount %': product.discount,
        'Final Rate (₹)': product.final_rate,
        'Stock': product.stock
      }));
      
      exportToExcel(exportData, 'price_list', 'Price List');
      toast({
        title: "Export Successful",
        description: "Price list exported to Excel successfully"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export price list",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Image */}
        <div className="bg-gradient-festive text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Price List & Quick Order</h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Complete price list with all product details. Add quantities and order in bulk.
              </p>
            </div>
            <div className="lg:w-1/3">
              <img 
                src={helloCrackersBranded} 
                alt="Hello Crackers - Premium Celebration Boxes"
                className="w-full max-w-[300px] h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search by product name, code, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportToExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-4">
              {filteredData.map((item) => {
                const amount = (parseInt(quantities[item.product_code] || "1") * item.final_rate);
            
                return (
                  <Card key={item.product_code} className="p-4">
                    <div className="flex gap-4">
                      {/* Image & Video */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20">
                          <img src={item.image_url || helloCrackersBranded} alt={item.product_name} className="w-full h-full object-cover rounded" />
                          {item.video_url && (
                            <button className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                              <Play className="h-4 w-4 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-brand-purple text-white text-xs">{item.product_code}</Badge>
                          <Badge variant="outline" className="text-xs">{item.user_for}</Badge>
                        </div>
                        
                        <h3 className="font-semibold text-sm">{item.product_name}</h3>
                        <div className="text-xs text-gray-600">{item.category} • {item.content || ''}</div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="line-through text-gray-400">₹{item.mrp}</span>
                            <span className="ml-2 font-semibold text-brand-red">₹{item.final_rate}</span>
                          </div>
                          <Badge className="bg-brand-red text-white text-xs">{item.discount}% OFF</Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Qty"
                            value={quantities[item.product_code] || ""}
                            onChange={(e) => handleQuantityChange(item.product_code, e.target.value)}
                            className="w-16 text-xs"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 bg-gradient-festive text-white text-xs"
                            disabled={!quantities[item.product_code]}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            ₹{amount}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop/Tablet View - Table */}
            <Card className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Image</th>
                      <th className="text-left p-3 font-semibold">Video</th>
                      <th className="text-left p-3 font-semibold">Code</th>
                      <th className="text-left p-3 font-semibold">Product Name</th>
                      <th className="text-left p-3 font-semibold">User For</th>
                      <th className="text-left p-3 font-semibold">Category</th>
                      <th className="text-left p-3 font-semibold">Content</th>
                      <th className="text-left p-3 font-semibold">Stock</th>
                      <th className="text-left p-3 font-semibold">MRP</th>
                      <th className="text-left p-3 font-semibold">Discount</th>
                      <th className="text-left p-3 font-semibold">Final Rate</th>
                      <th className="text-left p-3 font-semibold">Quantity</th>
                      <th className="text-left p-3 font-semibold">Amount</th>
                      <th className="text-left p-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => {
                      const amount = (parseInt(quantities[item.product_code] || "1") * item.final_rate);
                  
                      return (
                        <tr key={item.product_code} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <img src={item.image_url || helloCrackersBranded} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                          </td>
                          <td className="p-3">
                            {item.video_url ? (
                              <video src={item.video_url} className="w-10 h-10 rounded object-cover" muted />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                <Play className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge className="bg-brand-purple text-white">{item.product_code}</Badge>
                          </td>
                          <td className="p-3 font-medium">{item.product_name}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={`${
                              item.user_for === "Family" ? "border-brand-orange text-brand-orange" :
                              item.user_for === "Kids" ? "border-brand-gold text-brand-gold" :
                              "border-brand-purple text-brand-purple"
                            }`}>
                              {item.user_for}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">{item.category}</td>
                          <td className="p-3 text-gray-600">{item.content || ''}</td>
                          <td className="p-3 text-gray-600">{item.stock}</td>
                          <td className="p-3">
                            <span className="line-through text-gray-400">₹{item.mrp}</span>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-brand-red text-white">{item.discount}%</Badge>
                          </td>
                          <td className="p-3 font-semibold text-brand-red">₹{item.final_rate}</td>
                          <td className="p-3">
                            <Input
                              type="text"
                              placeholder="Enter qty"
                              value={quantities[item.product_code] || ""}
                              onChange={(e) => handleQuantityChange(item.product_code, e.target.value)}
                              className="w-24"
                            />
                          </td>
                          <td className="p-3 font-semibold">₹{amount}</td>
                          <td className="p-3">
                            <Button 
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="bg-gradient-festive text-white"
                              disabled={!quantities[item.product_code]}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Summary */}
        <Card className="mt-8 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-lg">
              Total Items: <span className="font-bold">{filteredData.length}</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="lg">
                Clear All Quantities
              </Button>
              <Button size="lg" className="bg-gradient-festive text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add Selected to Cart
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
      <StickyOrderButton />
    </div>
  );
};

export default PriceList;