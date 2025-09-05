import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, CreditCard, Loader2, Check, QrCode, Building } from "lucide-react";
import SupremeCourtNotice from "@/components/SupremeCourtNotice";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";
import RazorpayPayment from "@/components/RazorpayPayment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function Order() {
  const { cart, cartTotal, clearCart, getCartCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseHook = useSupabase();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    deliveryDate: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMode, setPaymentMode] = useState<'razorpay' | 'manual'>('manual');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>({});
  const [manualPaymentInfo, setManualPaymentInfo] = useState<any>({});

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    // Load payment settings
    loadPaymentSettings();
    
    // Initialize payment service
    paymentService.setSupabaseHook(supabaseHook);
  }, [cart, navigate]);

  const loadPaymentSettings = async () => {
    try {
      const [settings, manualInfo] = await Promise.all([
        paymentService.getPaymentSettings(),
        paymentService.getManualPaymentInstructions()
      ]);
      setPaymentSettings(settings);
      setManualPaymentInfo(manualInfo);
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (cartTotal < 3000) {
      toast({
        title: "Minimum Order Value",
        description: "Minimum order value is ₹3,000. Please add more items.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return null;

    try {
      setLoading(true);
      
      // Generate order number
      const orderNumber = `HC${Date.now()}`;
      
      // Create order in database
      const orderData = {
        order_number: orderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        items: cart as any, // Cast to Json type
        total_amount: cartTotal,
        payment_status: 'pending' as const,
        order_status: 'confirmed' as const,
        tracking_notes: formData.notes,
      };

      const { data, error } = await supabaseHook.supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      setOrderId(data.id);
      return data;

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Creation Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const order = await createOrder();
    if (!order) return;

    try {
      const razorpayOrder = await paymentService.createRazorpayOrder({
        orderId: order.id,
        amount: cartTotal,
        currency: 'INR',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart
      });

      setShowRazorpay(true);

    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast({
        title: "Payment Setup Failed",
        description: "Failed to setup online payment. Please try manual payment.",
        variant: "destructive"
      });
    }
  };

  const handleManualPayment = async () => {
    const order = await createOrder();
    if (!order) return;

    setOrderSuccess(true);
    clearCart();
    
    toast({
      title: "Order Placed Successfully!",
      description: "Your order has been placed. Please complete the payment using the instructions below.",
    });
  };

  const handlePaymentSuccess = async (paymentId: string, razorpayOrderId: string) => {
    try {
      setShowRazorpay(false);
      
      // Verify and process payment
      await paymentService.processPaymentSuccess(paymentId, orderId);
      
      setOrderSuccess(true);
      clearCart();
      
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed and payment is confirmed.",
      });

    } catch (error) {
      console.error('Error processing payment success:', error);
      toast({
        title: "Payment Processing Error",
        description: "Payment received but there was an error. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: any) => {
    setShowRazorpay(false);
    console.error('Payment error:', error);
    
    toast({
      title: "Payment Failed",
      description: "Payment was not completed. You can try again or use manual payment options.",
      variant: "destructive"
    });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SupremeCourtNotice />
        
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
            <p className="text-lg mb-6">Order ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>
            
            {paymentMode === 'manual' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Complete Your Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">{manualPaymentInfo.instructions}</p>
                  
                  {manualPaymentInfo.qrCodeUrl && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        UPI Payment
                      </h4>
                      <img 
                        src={manualPaymentInfo.qrCodeUrl} 
                        alt="Payment QR Code"
                        className="w-48 h-48 mx-auto border rounded"
                      />
                    </div>
                  )}
                  
                  {manualPaymentInfo.bankDetails && (
                    <div className="text-left">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Bank Transfer Details
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Bank Name:</strong> {manualPaymentInfo.bankDetails.bankName}</p>
                        <p><strong>Account Number:</strong> {manualPaymentInfo.bankDetails.accountNumber}</p>
                        <p><strong>IFSC Code:</strong> {manualPaymentInfo.bankDetails.ifscCode}</p>
                        <p><strong>Branch:</strong> {manualPaymentInfo.bankDetails.branchName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={() => navigate('/')} variant="outline">
                Continue Shopping
              </Button>
              <Button onClick={() => navigate('/track-order')} className="bg-gradient-festive">
                Track Order
              </Button>
            </div>
          </Card>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SupremeCourtNotice />
      
      {/* Page Header */}
      <section className="bg-gradient-festive text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Complete Your Order</h1>
            <p className="text-xl text-white/90">
              {getCartCount()} items • Total: ₹{cartTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>
            
            <div className="space-y-6">
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

              {/* Payment Options */}
              {paymentSettings.razorpayEnabled && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Payment Method</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={`p-4 cursor-pointer border-2 ${paymentMode === 'razorpay' ? 'border-brand-orange bg-orange-50' : 'border-gray-200'}`} 
                          onClick={() => setPaymentMode('razorpay')}>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-brand-orange" />
                        <div>
                          <h4 className="font-semibold">Online Payment</h4>
                          <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className={`p-4 cursor-pointer border-2 ${paymentMode === 'manual' ? 'border-brand-orange bg-orange-50' : 'border-gray-200'}`} 
                          onClick={() => setPaymentMode('manual')}>
                      <div className="flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-brand-orange" />
                        <div>
                          <h4 className="font-semibold">Manual Payment</h4>
                          <p className="text-sm text-gray-600">UPI/Bank Transfer</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="space-y-3">
                {paymentSettings.razorpayEnabled && paymentMode === 'razorpay' ? (
                  <Button 
                    onClick={handleRazorpayPayment} 
                    disabled={loading}
                    className="w-full bg-gradient-festive text-white font-semibold py-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${cartTotal.toLocaleString()} Online`
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleManualPayment} 
                    disabled={loading}
                    className="w-full bg-gradient-festive text-white font-semibold py-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Order Summary & Cart Items */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.productCode} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-600">₹{item.finalRate} × {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.finalRate * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-brand-red">₹{cartTotal.toLocaleString()}</span>
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
                  <p className="text-sm text-gray-700">Order confirmation within 24 hours</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Component */}
      {showRazorpay && orderId && (
        <RazorpayPayment
          orderId={orderId}
          amount={cartTotal}
          customerName={formData.name}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

      <Footer />
    </div>
  );
}