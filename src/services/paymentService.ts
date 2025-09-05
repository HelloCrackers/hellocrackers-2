import { useSupabase } from "@/hooks/useSupabase";

export interface PaymentSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret?: string;
}

export interface OrderPaymentData {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
}

class PaymentService {
  private static instance: PaymentService;
  private supabaseHook: ReturnType<typeof useSupabase> | null = null;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  setSupabaseHook(hook: ReturnType<typeof useSupabase>) {
    this.supabaseHook = hook;
  }

  async getPaymentSettings(): Promise<PaymentSettings> {
    if (!this.supabaseHook) {
      throw new Error("Supabase hook not initialized");
    }

    const settings = await this.supabaseHook.fetchPaymentSettings();
    
    return {
      razorpayEnabled: settings.find(s => s.key === 'razorpay_enabled')?.value === 'true',
      razorpayKeyId: settings.find(s => s.key === 'razorpay_key_id')?.value || '',
      razorpayKeySecret: settings.find(s => s.key === 'razorpay_key_secret')?.value || '',
      razorpayWebhookSecret: settings.find(s => s.key === 'razorpay_webhook_secret')?.value,
    };
  }

  async createRazorpayOrder(orderData: OrderPaymentData): Promise<any> {
    const settings = await this.getPaymentSettings();
    
    if (!settings.razorpayEnabled || !settings.razorpayKeyId || !settings.razorpayKeySecret) {
      throw new Error("Razorpay is not properly configured");
    }

    // In a real implementation, this would make an API call to your backend
    // which would then create a Razorpay order using the Razorpay API
    // For now, we'll simulate this
    const mockRazorpayOrder = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: orderData.amount * 100, // Amount in paisa
      amount_paid: 0,
      amount_due: orderData.amount * 100,
      currency: orderData.currency,
      receipt: orderData.orderId,
      offer_id: null,
      status: "created",
      attempts: 0,
      notes: {
        order_id: orderData.orderId,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
      },
      created_at: Math.floor(Date.now() / 1000)
    };

    return mockRazorpayOrder;
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    const settings = await this.getPaymentSettings();
    
    if (!settings.razorpayKeySecret) {
      throw new Error("Razorpay key secret not configured");
    }

    // In a real implementation, this would verify the payment signature
    // using the Razorpay webhook secret and crypto verification
    // For now, we'll simulate a successful verification
    console.log('Verifying payment:', { paymentId, orderId, signature });
    
    return true; // Simulate successful verification
  }

  async processPaymentSuccess(paymentId: string, orderId: string): Promise<void> {
    if (!this.supabaseHook) {
      throw new Error("Supabase hook not initialized");
    }

    // Update the order payment status
    await this.supabaseHook.updateOrderPaymentStatus(orderId, true, `Razorpay payment successful: ${paymentId}`);
  }

  async getManualPaymentInstructions(): Promise<{
    qrCodeUrl?: string;
    bankDetails?: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      branchName: string;
    };
    instructions: string;
  }> {
    if (!this.supabaseHook) {
      throw new Error("Supabase hook not initialized");
    }

    const settings = await this.supabaseHook.fetchPaymentSettings();
    
    const bankName = settings.find(s => s.key === 'bank_name')?.value;
    const accountNumber = settings.find(s => s.key === 'account_number')?.value;
    const ifscCode = settings.find(s => s.key === 'ifsc_code')?.value;
    const branchName = settings.find(s => s.key === 'branch_name')?.value;

    return {
      qrCodeUrl: settings.find(s => s.key === 'payment_qr_code')?.value,
      bankDetails: bankName && accountNumber && ifscCode ? {
        bankName,
        accountNumber,
        ifscCode,
        branchName: branchName || '',
      } : undefined,
      instructions: settings.find(s => s.key === 'payment_instructions')?.value || 
        'Please complete your payment using the QR code or bank details provided. Once payment is done, confirmation will be updated by our team.',
    };
  }
}

export const paymentService = PaymentService.getInstance();