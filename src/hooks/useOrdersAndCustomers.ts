import { useSupabase } from './useSupabase';
import { useToast } from './use-toast';

export const useOrdersAndCustomers = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const createCustomerFromOrder = async (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address?: string;
  }) => {
    try {
      // Check if customer already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, total_orders, total_spent')
        .eq('phone', orderData.customer_phone)
        .single();

      if (existingCustomer) {
        // Update existing customer stats
        const { error: updateError } = await supabase
          .from('customers')
          .update({
            total_orders: existingCustomer.total_orders + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCustomer.id);

        if (updateError) throw updateError;
        return existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: insertError } = await supabase
          .from('customers')
          .insert({
            name: orderData.customer_name,
            email: orderData.customer_email,
            phone: orderData.customer_phone,
            address: orderData.customer_address,
            total_orders: 1,
            total_spent: 0,
            status: 'active'
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        return newCustomer.id;
      }
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      return null;
    }
  };

  const updateCustomerSpending = async (phone: string, orderAmount: number) => {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id, total_spent')
        .eq('phone', phone)
        .single();

      if (customer) {
        const { error } = await supabase
          .from('customers')
          .update({
            total_spent: customer.total_spent + orderAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', customer.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating customer spending:', error);
    }
  };

  const createOrderRecord = async (orderData: {
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
  }) => {
    try {
      // First create/update customer
      await createCustomerFromOrder({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address
      });

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .single();

      if (orderError) throw orderError;

      // If payment is confirmed, update customer spending
      if (orderData.payment_status === 'paid') {
        await updateCustomerSpending(orderData.customer_phone, orderData.total_amount);
      }

      toast({
        title: "Order Created Successfully",
        description: `Order ${orderData.order_number} has been recorded and customer details updated.`
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Creation Failed",
        description: "Failed to create order record. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: 'paid' | 'failed', paymentId?: string) => {
    try {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('customer_phone, total_amount')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // If payment is successful, update customer total spending
      if (paymentStatus === 'paid') {
        await updateCustomerSpending(order.customer_phone, order.total_amount);
      }

      return true;
    } catch (error) {
      console.error('Error updating order payment status:', error);
      return false;
    }
  };

  return {
    createOrderRecord,
    updateOrderPaymentStatus,
    createCustomerFromOrder,
    updateCustomerSpending
  };
};