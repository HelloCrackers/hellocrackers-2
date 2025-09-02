import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Play, ShoppingCart } from "lucide-react";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import crackersDisplay from "@/assets/crackers-display.jpg";
import helloCrackersBranded from "@/assets/hello-crackers-branded.png";

// Mock product data with the exact format requested
const products = [
  {
    productCode: "H001",
    image: crackersDisplay,
    video: crackersDisplay, // In real app, this would be video
    userFor: "Family",
    productName: "Flower Pots",
    category: "Fancy Crackers",
    mrp: 500,
    discount: 90,
    finalRate: 50,
    rating: 4.8,
    reviews: 245,
    comments: "Excellent quality! Kids loved it."
  },
  {
    productCode: "H002",
    image: crackersDisplay,
    video: crackersDisplay,
    userFor: "Adult",
    productName: "Atom Bomb",
    category: "Fancy Crackers",
    mrp: 1000,
    discount: 90,
    finalRate: 100,
    rating: 4.9,
    reviews: 189,
    comments: "Amazing sound and effect!"
  },
  {
    productCode: "H003",
    image: crackersDisplay,
    video: crackersDisplay,
    userFor: "Kids",
    productName: "Sparklers Premium",
    category: "Sparklers",
    mrp: 200,
    discount: 90,
    finalRate: 20,
    rating: 4.7,
    reviews: 356,
    comments: "Safe for children, long burning time."
  },
  {
    productCode: "H004",
    image: crackersDisplay,
    video: crackersDisplay,
    userFor: "Family",
    productName: "Twinkling Star",
    category: "Fancy Crackers",
    mrp: 800,
    discount: 90,
    finalRate: 80,
    rating: 4.6,
    reviews: 142,
    comments: "Beautiful colors and patterns."
  },
  {
    productCode: "H005",
    image: crackersDisplay,
    video: crackersDisplay,
    userFor: "Adult",
    productName: "Bijili Crackers",
    category: "Bijili Crackers",
    mrp: 1500,
    discount: 90,
    finalRate: 150,
    rating: 4.8,
    reviews: 98,
    comments: "Powerful sound, great quality."
  },
  {
    productCode: "H006",
    image: crackersDisplay,
    video: crackersDisplay,
    userFor: "Kids",
    productName: "Safe Sparklers",
    category: "Sparklers",
    mrp: 150,
    discount: 90,
    finalRate: 15,
    rating: 4.9,
    reviews: 423,
    comments: "Perfect for young children, very safe."
  }
];

export default function Products() {
  const [activeTab, setActiveTab] = useState("Family Crackers");
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});
  const [showMinOrderDialog, setShowMinOrderDialog] = useState(false);
  const navigate = useNavigate();
  const { addToCart, checkMinimumOrder } = useCart();
  const { toast } = useToast();

  const tabs = ["Family Crackers", "Adult Crackers", "Kids Crackers"];

  const filteredProducts = products.filter(
    product => activeTab.includes(product.userFor)
  );

  const updateQuantity = (productCode: string, quantity: string) => {
    setQuantities(prev => ({
      ...prev,
      [productCode]: quantity
    }));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    const qty = parseInt(quantities[product.productCode] || "1");
    if (qty > 0) {
      addToCart({
        productCode: product.productCode,
        productName: product.productName,
        finalRate: product.finalRate,
        image: product.image,
        userFor: product.userFor
      }, qty);
      
      // Reset quantity input
      setQuantities(prev => ({
        ...prev,
        [product.productCode]: ""
      }));
    }
  };

  const handleCartClick = () => {
    if (!checkMinimumOrder()) {
      setShowMinOrderDialog(true);
      return;
    }
    navigate('/cart');
  };

  const getAmount = (finalRate: number, productCode: string) => {
    const qty = parseInt(quantities[productCode] || "1");
    return finalRate * qty;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Image Section */}
      <section className="bg-gradient-festive text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Premium Crackers Collection</h1>
              <p className="text-lg md:text-xl text-white/90">Direct Factory Outlet - 90% OFF on All Products</p>
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
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-festive text-white shadow-festive"
                  : "bg-white text-gray-600 hover:bg-brand-orange hover:text-white shadow-md border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          {/* Header Row - Desktop Only */}
          <div className="hidden xl:grid xl:grid-cols-12 gap-2 bg-gradient-celebration text-white p-3 rounded-lg font-semibold text-xs">
            <div className="col-span-1">Code</div>
            <div className="col-span-1">Image</div>
            <div className="col-span-1">Video</div>
            <div className="col-span-1">User For</div>
            <div className="col-span-2">Product Name</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-1">MRP (₹)</div>
            <div className="col-span-1">Discount</div>
            <div className="col-span-1">Final Rate (₹)</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-1">Amount (₹)</div>
          </div>

          {/* Mobile/Tablet Header - Table Format */}
          <div className="xl:hidden overflow-x-auto">
            <div className="min-w-[800px] bg-gradient-celebration text-white p-2 rounded-lg">
              <div className="grid grid-cols-11 gap-2 font-semibold text-xs">
                <div>Code</div>
                <div>Image</div>
                <div>Video</div>
                <div>User</div>
                <div>Product Name</div>
                <div>Category</div>
                <div>MRP</div>
                <div>Disc</div>
                <div>Rate</div>
                <div>Qty</div>
                <div>Amount</div>
              </div>
            </div>
          </div>

          {/* Product Rows */}
          {filteredProducts.map((product) => (
            <Card key={product.productCode} className="overflow-hidden hover:shadow-celebration transition-all duration-300">
              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-1">
                  <Badge variant="outline" className="border-brand-red text-brand-red">
                    {product.productCode}
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  <img 
                    src={product.image} 
                    alt={product.productName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                
                <div className="col-span-1">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <Play className="h-6 w-6 text-brand-orange" />
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Badge 
                    className={`${
                      product.userFor === "Family" ? "bg-brand-gold text-black" :
                      product.userFor === "Adult" ? "bg-brand-red text-white" :
                      "bg-brand-purple text-white"
                    }`}
                  >
                    {product.userFor}
                  </Badge>
                </div>
                
                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-800">{product.productName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <span className="text-sm text-gray-600">{product.category}</span>
                </div>
                
                <div className="col-span-1">
                  <span className="text-gray-500 line-through">₹{product.mrp}</span>
                </div>
                
                <div className="col-span-1">
                  <Badge className="bg-brand-orange text-white">
                    {product.discount}% OFF
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  <span className="font-bold text-brand-red text-lg">₹{product.finalRate}</span>
                </div>
                
                 <div className="col-span-1">
                   <Input
                     type="number"
                     min="1"
                     value={quantities[product.productCode] || ""}
                     onChange={(e) => updateQuantity(product.productCode, e.target.value)}
                     className="w-20 text-center"
                     placeholder="Qty"
                   />
                   <div className="text-xs text-gray-500 mt-1">
                     Bulk: 5,10,100
                   </div>
                 </div>
                
                <div className="col-span-1">
                  <div className="text-center">
                    <div className="font-bold text-brand-red">₹{getAmount(product.finalRate, product.productCode)}</div>
                    <Button variant="cart" size="sm" className="mt-2 w-full" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="mt-2 bg-gray-100 rounded-lg w-20 h-12 flex items-center justify-center">
                      <Play className="h-4 w-4 text-brand-orange" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-brand-red text-brand-red">
                        {product.productCode}
                      </Badge>
                      <Badge 
                        className={`${
                          product.userFor === "Family" ? "bg-brand-gold text-black" :
                          product.userFor === "Adult" ? "bg-brand-red text-white" :
                          "bg-brand-purple text-white"
                        }`}
                      >
                        {product.userFor}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-500 line-through">₹{product.mrp}</span>
                      <Badge className="bg-brand-orange text-white">{product.discount}% OFF</Badge>
                      <span className="font-bold text-brand-red text-xl">₹{product.finalRate}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2">
                         <span className="text-sm">Qty:</span>
                         <Input
                           type="number"
                           min="1"
                           value={quantities[product.productCode] || ""}
                           onChange={(e) => updateQuantity(product.productCode, e.target.value)}
                           className="w-20 text-center"
                           placeholder="Qty"
                         />
                         <div className="text-xs text-gray-500">
                           Bulk: 5,10,100
                         </div>
                       </div>
                      <div className="text-right flex-1">
                        <div className="font-bold text-brand-red text-lg">₹{getAmount(product.finalRate, product.productCode)}</div>
                        <Button variant="cart" size="sm" className="mt-1" onClick={() => handleAddToCart(product)}>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                    
                    {/* Customer Comments */}
                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600 italic">"{product.comments}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Minimum Order Dialog */}
        <AlertDialog open={showMinOrderDialog} onOpenChange={setShowMinOrderDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-brand-red">Hello Crackers</AlertDialogTitle>
              <AlertDialogDescription className="text-lg">
                Dear Customer, the minimum order value is ₹3000. Kindly add more items to proceed with your order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowMinOrderDialog(false)}
                className="bg-gradient-festive text-white"
              >
                Continue Shopping
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer />
      <StickyOrderButton />
    </div>
  );
}