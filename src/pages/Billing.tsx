import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Calendar, CreditCard, Receipt, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Billing() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    deliveryDate: "",
    notes: ""
  });

  const [challanNumber, setChallanNumber] = useState("");
  const [showChallan, setShowChallan] = useState(false);

  const generateChallanNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const orderNumber = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    return `HC${year}${orderNumber}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newChallanNumber = generateChallanNumber();
    setChallanNumber(newChallanNumber);
    setShowChallan(true);
    
    toast({
      title: "Order Confirmed!",
      description: `Challan ${newChallanNumber} generated successfully`,
    });
  };

  const handlePayment = (method: string) => {
    toast({
      title: "Payment Initiated",
      description: `Redirecting to ${method} payment...`,
    });
    
    // Simulate payment process
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed and will be processed shortly.",
      });
      clearCart();
      navigate('/');
    }, 2000);
  };

  const downloadChallan = () => {
    // Create a simple text-based challan
    const challanContent = `
HELLO CRACKERS - BILLING CHALLAN
=====================================
Challan No: ${challanNumber}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Customer Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}
Pincode: ${formData.pincode}

Order Details:
${cart.map(item => 
  `${item.productName} (${item.userFor}) - Qty: ${item.quantity} - ₹${(item.finalRate * item.quantity).toLocaleString()}`
).join('\n')}

Total Amount: ₹${cartTotal.toLocaleString()}

Thank you for choosing Hello Crackers!
Contact: 9042132123, 9629088412
    `;
    
    const blob = new Blob([challanContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HelloCrackers_Challan_${challanNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-festive text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Billing & Payment</h1>
            <p className="text-xl text-white/90">Complete your order with secure payment</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Billing Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Customer Details</h3>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Delivery Address</h3>
                
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Any special requirements..."
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-festive text-white font-semibold py-3">
                <Receipt className="h-5 w-5 mr-2" />
                Generate Challan
              </Button>
            </form>
          </Card>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productCode} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-600">Qty: {item.quantity} × ₹{item.finalRate}</p>
                    </div>
                    <p className="font-semibold">₹{(item.finalRate * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-brand-red">₹{cartTotal.toLocaleString()}</span>
              </div>
            </Card>

            {/* Challan Display */}
            {showChallan && (
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-800">Challan Generated</h3>
                  <Button variant="outline" size="sm" onClick={downloadChallan}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Challan Number:</strong> {challanNumber}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                  <p><strong>Amount:</strong> ₹{cartTotal.toLocaleString()}</p>
                </div>
              </Card>
            )}

            {/* Payment Options */}
            {showChallan && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Options
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => handlePayment('UPI')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Pay via UPI
                  </Button>
                  
                  <Button 
                    onClick={() => handlePayment('Bank Transfer')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Bank Transfer
                  </Button>
                  
                  <Button 
                    onClick={() => handlePayment('Cash on Delivery')}
                    variant="outline"
                    className="w-full"
                  >
                    Cash on Delivery
                  </Button>
                </div>
                
                <div className="mt-4 text-xs text-gray-600">
                  <p>• All payments are secure and encrypted</p>
                  <p>• GST bills provided for all orders</p>
                  <p>• Free delivery across Tamil Nadu</p>
                </div>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium">Contact Numbers</p>
                    <p className="text-sm text-gray-600">9042132123, 9629088412</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">Sivakasi, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}