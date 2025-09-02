import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Play, ShoppingCart } from "lucide-react";
import helloCrackersBranded from "@/assets/hello-crackers-branded.png";

// Same product data as Products page
const priceListData = [
  {
    code: "H001",
    image: "/api/placeholder/80/80",
    video: "video-thumb.mp4",
    name: "Flower Pots Deluxe",
    userFor: "Family",
    category: "Fancy Crackers",
    content: "Pack of 5",
    mrp: 500,
    discount: 90,
    finalRate: 50
  },
  {
    code: "H002",
    image: "/api/placeholder/80/80", 
    video: "video-thumb2.mp4",
    name: "Atom Bomb Premium",
    userFor: "Adult",
    category: "Bijili Crackers",
    content: "Single piece",
    mrp: 1000,
    discount: 90,
    finalRate: 100
  },
  {
    code: "H003",
    image: "/api/placeholder/80/80",
    video: "video-thumb3.mp4",
    name: "Safe Sparklers",
    userFor: "Kids",
    category: "Sparklers", 
    content: "Pack of 10",
    mrp: 200,
    discount: 90,
    finalRate: 20
  },
  {
    code: "H004",
    image: "/api/placeholder/80/80",
    video: "video-thumb4.mp4",
    name: "Twinkling Star Special",
    userFor: "Adult",
    category: "Twinkling Star",
    content: "Pack of 3",
    mrp: 800,
    discount: 90,
    finalRate: 80
  },
  {
    code: "H005",
    image: "/api/placeholder/80/80",
    video: "video-thumb5.mp4", 
    name: "Ground Chakra Mega",
    userFor: "Family",
    category: "Fancy Crackers",
    content: "Single piece",
    mrp: 600,
    discount: 90,
    finalRate: 60
  }
];

const PriceList = () => {
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = priceListData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (code: string, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setQuantities(prev => ({
        ...prev,
        [code]: value
      }));
    }
  };

  const addToCart = (item: any) => {
    const qty = quantities[item.code] || "1";
    console.log(`Adding ${qty} of ${item.name} to cart`);
  };

  const exportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  const exportToExcel = () => {
    console.log("Exporting to Excel...");
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
              <Button variant="outline" onClick={exportToExcel}>
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

        {/* Mobile View - Cards */}
        <div className="block md:hidden space-y-4">
          {filteredData.map((item) => {
            const amount = (parseInt(quantities[item.code] || "1") * item.finalRate);
            
            return (
              <Card key={item.code} className="p-4">
                <div className="flex gap-4">
                  {/* Image & Video */}
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      <button className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                        <Play className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-brand-purple text-white text-xs">{item.code}</Badge>
                      <Badge variant="outline" className="text-xs">{item.userFor}</Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <div className="text-xs text-gray-600">{item.category} • {item.content}</div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="line-through text-gray-400">₹{item.mrp}</span>
                        <span className="ml-2 font-semibold text-brand-red">₹{item.finalRate}</span>
                      </div>
                      <Badge className="bg-brand-red text-white text-xs">{item.discount}% OFF</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Qty"
                        value={quantities[item.code] || ""}
                        onChange={(e) => handleQuantityChange(item.code, e.target.value)}
                        className="w-16 text-xs"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-gradient-festive text-white text-xs"
                        disabled={!quantities[item.code]}
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
                  const amount = (parseInt(quantities[item.code] || "1") * item.finalRate);
                  
                  return (
                    <tr key={item.code} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="p-3">
                        <button className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200">
                          <Play className="h-4 w-4 text-gray-600" />
                        </button>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-brand-purple text-white">{item.code}</Badge>
                      </td>
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${
                          item.userFor === "Family" ? "border-brand-orange text-brand-orange" :
                          item.userFor === "Kids" ? "border-brand-gold text-brand-gold" :
                          "border-brand-purple text-brand-purple"
                        }`}>
                          {item.userFor}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{item.category}</td>
                      <td className="p-3 text-gray-600">{item.content}</td>
                      <td className="p-3">
                        <span className="line-through text-gray-400">₹{item.mrp}</span>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-brand-red text-white">{item.discount}%</Badge>
                      </td>
                      <td className="p-3 font-semibold text-brand-red">₹{item.finalRate}</td>
                      <td className="p-3">
                        <Input
                          type="text"
                          placeholder="Enter qty"
                          value={quantities[item.code] || ""}
                          onChange={(e) => handleQuantityChange(item.code, e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3 font-semibold">₹{amount}</td>
                      <td className="p-3">
                        <Button 
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="bg-gradient-festive text-white"
                          disabled={!quantities[item.code]}
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