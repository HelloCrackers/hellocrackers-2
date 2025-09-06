import { useEffect } from 'react';
import { useOrdersAndCustomers } from '@/hooks/useOrdersAndCustomers';

interface OrderPlacementHookProps {
  orderData?: {
    order_number: string;
    challan_number?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address?: string;
    items: any;
    total_amount: number;
    payment_status: 'pending' | 'paid' | 'failed';
    payment_id?: string;
    order_status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  };
  onOrderPlaced?: (success: boolean) => void;
}

export const OrderPlacementHook = ({ orderData, onOrderPlaced }: OrderPlacementHookProps) => {
  const { createOrderRecord } = useOrdersAndCustomers();

  useEffect(() => {
    if (orderData) {
      handleOrderPlacement();
    }
  }, [orderData]);

  const handleOrderPlacement = async () => {
    if (!orderData) return;

    const result = await createOrderRecord(orderData);
    onOrderPlaced?.(!!result);
  };

  return null; // This is a hook component, no UI
};

// Hook for payment completion
export const usePaymentCompletion = () => {
  const { updateOrderPaymentStatus } = useOrdersAndCustomers();

  const handlePaymentSuccess = async (orderId: string, paymentId: string) => {
    const success = await updateOrderPaymentStatus(orderId, 'paid', paymentId);
    if (success) {
      console.log('Payment completed, customer and order records updated');
    }
    return success;
  };

  const handlePaymentFailure = async (orderId: string) => {
    const success = await updateOrderPaymentStatus(orderId, 'failed');
    return success;
  };

  return {
    handlePaymentSuccess,
    handlePaymentFailure
  };
};