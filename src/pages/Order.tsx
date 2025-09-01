import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, CreditCard } from "lucide-react";
import SupremeCourtNotice from "@/components/SupremeCourtNotice";

export default function Order() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    deliveryDate: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log("Order submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Supreme Court Notice */}
      <SupremeCourtNotice />
      
      {/* Page Header */}
      <section className="bg-gradient-festive text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Place Your Order</h1>
            <p className="text-xl text-white/90">Submit your crackers enquiry - We'll contact you within 24 hours</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
                
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

              {/* Delivery Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Delivery Information</h3>
                
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
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

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-festive text-white font-semibold py-3">
                Submit Enquiry
              </Button>
            </form>
          </Card>

          {/* Order Summary & Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium">Phone Numbers</p>
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

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-brand-orange" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">9:00 AM - 7:00 PM (Mon-Sat)</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Important Information */}
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Important Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge className="bg-brand-red text-white">!</Badge>
                  <p className="text-sm text-gray-700">Minimum order value: ₹3,000</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Badge className="bg-brand-orange text-white">✓</Badge>
                  <p className="text-sm text-gray-700">Free delivery across Tamil Nadu</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Badge className="bg-brand-gold text-black">⚡</Badge>
                  <p className="text-sm text-gray-700">We'll contact you within 24 hours</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Badge className="bg-brand-purple text-white">📱</Badge>
                  <p className="text-sm text-gray-700">Order confirmation via WhatsApp or phone</p>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Cash on Delivery available</p>
                <p className="text-sm text-gray-600">• Online payment options available</p>
                <p className="text-sm text-gray-600">• Advance payment for bulk orders</p>
                <p className="text-sm text-gray-600">• GST bills provided for all orders</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}