import { useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface RazorpayPaymentProps {
  orderId: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  orderId,
  amount,
  currency = "INR",
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}) => {
  const { fetchPaymentSettings } = useSupabase();
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initializePayment = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Get Razorpay settings
      const settings = await fetchPaymentSettings();
      const razorpayKeyId = settings.find(s => s.key === 'razorpay_key_id')?.value;
      
      if (!razorpayKeyId) {
        throw new Error("Razorpay Key ID not configured");
      }

      const options = {
        key: razorpayKeyId,
        amount: amount * 100, // Razorpay expects amount in paisa
        currency,
        name: "Hello Crackers",
        description: `Order #${orderId}`,
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#F97316", // brand-orange
        },
        handler: function (response: any) {
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        },
        modal: {
          ondismiss: function () {
            onError(new Error("Payment cancelled by user"));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      onError(error);
    }
  };

  useEffect(() => {
    initializePayment();
  }, []);

  return null; // This component doesn't render anything
};

export default RazorpayPayment;