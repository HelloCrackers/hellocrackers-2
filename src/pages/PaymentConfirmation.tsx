import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupabase, PaymentSetting } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Building, Clock, CheckCircle } from "lucide-react";

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchPaymentSettings } = useSupabase();
  const { toast } = useToast();
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([]);
  const [loading, setLoading] = useState(true);
  
  const orderNumber = searchParams.get('order') || '';
  const totalAmount = searchParams.get('amount') || '0';

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const settings = await fetchPaymentSettings();
      setPaymentSettings(settings);
    } catch (error) {
      toast({
        title: "Failed to load payment options",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = paymentSettings.find(s => s.key === key);
    return setting?.value || '';
  };

  const razorpayEnabled = getSettingValue('razorpay_enabled') === 'true';
  const qrCodeUrl = getSettingValue('payment_qr_code');
  const bankName = getSettingValue('bank_name');
  const accountNumber = getSettingValue('account_number');
  const ifscCode = getSettingValue('ifsc_code');
  const branchName = getSettingValue('branch_name');
  const paymentInstructions = getSettingValue('payment_instructions');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!razorpayEnabled) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Manual Payment Not Available</h1>
            <p className="text-muted-foreground">Manual payment mode is currently disabled.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return to Home
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Confirmation Header */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-600">Order Confirmed!</h1>
                <p className="text-muted-foreground">Your order has been successfully placed</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-xl text-brand-red">₹{totalAmount}</p>
              </div>
            </div>
          </Card>

          {/* Payment Instructions */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Complete Your Payment</h2>
                <p className="text-muted-foreground">Choose your preferred payment method</p>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">{paymentInstructions}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* UPI QR Code Payment */}
            {qrCodeUrl && (
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">UPI Payment</h3>
                    <p className="text-sm text-muted-foreground">Scan QR code to pay</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI Payment QR Code" 
                    className="w-64 h-64 object-contain mx-auto border rounded-lg"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Scan this QR code with any UPI app to make payment
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    ₹{totalAmount}
                  </Badge>
                </div>
              </Card>
            )}

            {/* Bank Transfer Details */}
            {bankName && accountNumber && ifscCode && (
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Bank Transfer</h3>
                    <p className="text-sm text-muted-foreground">Direct bank transfer details</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-semibold">{bankName}</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-semibold font-mono">{accountNumber}</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">IFSC Code</p>
                    <p className="font-semibold font-mono">{ifscCode}</p>
                  </div>
                  
                  {branchName && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Branch</p>
                      <p className="font-semibold">{branchName}</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-brand-red text-white rounded-lg text-center">
                    <p className="text-sm">Amount to Transfer</p>
                    <p className="text-xl font-bold">₹{totalAmount}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Complete Payment</p>
                  <p className="text-sm text-muted-foreground">Use any of the above methods to complete your payment</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Payment Verification</p>
                  <p className="text-sm text-muted-foreground">Our team will verify your payment within 2-4 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">Once payment is confirmed, your order will be processed for delivery</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/track-order?order=' + orderNumber)}
            >
              Track Order
            </Button>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}