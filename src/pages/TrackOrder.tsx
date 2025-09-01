import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, MapPin, Clock, CheckCircle, Phone } from "lucide-react";

const TrackOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  const mockTrackingData = {
    orderId: "ORD001",
    challanNo: "CH001",
    customerName: "John Doe",
    customerPhone: "+91 98765 43210",
    courierPartner: "Blue Dart Express",
    vehicleNo: "TN 01 AB 1234",
    status: "Out for Delivery",
    estimatedDelivery: "Today, 6:00 PM",
    timeline: [
      {
        status: "Order Placed",
        date: "Nov 10, 2024 - 10:30 AM",
        description: "Your order has been confirmed and payment verified",
        completed: true
      },
      {
        status: "Packed & Ready",
        date: "Nov 11, 2024 - 2:15 PM", 
        description: "Your crackers have been safely packed for delivery",
        completed: true
      },
      {
        status: "Shipped",
        date: "Nov 11, 2024 - 5:45 PM",
        description: "Your order is on the way to the delivery location",
        completed: true
      },
      {
        status: "Out for Delivery",
        date: "Nov 12, 2024 - 9:00 AM",
        description: "Your order is out for delivery and will reach you soon",
        completed: true,
        current: true
      },
      {
        status: "Delivered",
        date: "Expected today by 6:00 PM",
        description: "Your order will be delivered to your address",
        completed: false
      }
    ],
    items: [
      { code: "H001", name: "Flower Pots Deluxe", qty: 2, amount: "₹100" },
      { code: "H003", name: "Safe Sparklers", qty: 5, amount: "₹100" }
    ]
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Simulate tracking lookup
      setTrackingData(mockTrackingData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-600";
      case "out for delivery": return "bg-blue-600";
      case "shipped": return "bg-orange-500";
      case "processing": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-festive bg-clip-text text-transparent">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your Order ID or Challan Number to track your Hello Crackers delivery
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="Enter Order ID or Challan Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-gradient-festive text-white">
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              e.g., ORD001 or CH001
            </p>
          </div>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Order ID: <strong>{trackingData.orderId}</strong></span>
                    <span>Challan: <strong>{trackingData.challanNo}</strong></span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(trackingData.status)} text-white text-lg px-4 py-2`}>
                  {trackingData.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-orange text-white rounded-full p-2">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Customer</div>
                    <div className="text-sm text-gray-600">{trackingData.customerName}</div>
                    <div className="text-sm text-gray-600">{trackingData.customerPhone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-brand-purple text-white rounded-full p-2">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Courier Partner</div>
                    <div className="text-sm text-gray-600">{trackingData.courierPartner}</div>
                    <div className="text-sm text-gray-600">Vehicle: {trackingData.vehicleNo}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-brand-gold text-black rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Estimated Delivery</div>
                    <div className="text-sm text-gray-600">{trackingData.estimatedDelivery}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tracking Timeline */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Delivery Timeline</h3>
              <div className="space-y-4">
                {trackingData.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    } ${step.current ? 'ring-4 ring-blue-200' : ''}`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-semibold ${step.current ? 'text-blue-600' : 'text-gray-800'}`}>
                          {step.status}
                        </h4>
                        {step.current && (
                          <Badge className="bg-blue-600 text-white">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{step.date}</div>
                      <div className="text-sm text-gray-700 mt-1">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Order Items</h3>
              <div className="space-y-3">
                {trackingData.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">Code: {item.code} • Qty: {item.qty}</div>
                    </div>
                    <div className="font-semibold">{item.amount}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-r from-brand-orange/10 to-brand-red/10 border-2 border-brand-orange/20">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Contact our support team for any delivery-related queries
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                  <Button variant="outline">
                    Call: 1800-XXX-XXXX
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* No Results State */}
        {searchTerm && !trackingData && (
          <Card className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Package className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Order Found</h3>
              <p>Please check your Order ID or Challan Number and try again.</p>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        {!trackingData && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-center mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-brand-orange mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Find Store</h4>
                <p className="text-sm text-gray-600">Locate nearest Hello Crackers outlet</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Phone className="h-8 w-8 text-brand-purple mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Support</h4>
                <p className="text-sm text-gray-600">Get help with your order</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Package className="h-8 w-8 text-brand-gold mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Order Again</h4>
                <p className="text-sm text-gray-600">Reorder your favorite crackers</p>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;