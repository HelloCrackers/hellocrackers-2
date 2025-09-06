import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  product_code: string;
  product_name: string;
  category: string;
  description?: string;
  content?: string;
  user_for: 'Family' | 'Adult' | 'Kids';
  mrp: number;
  discount: number;
  final_rate: number;
  stock: number;
  image_url?: string;
  video_url?: string;
  rating: number;
  reviews_count: number;
  status: 'active' | 'inactive';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
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
  tracking_notes?: string;
  manual_payment_confirmed?: boolean;
  payment_proof_url?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  section_name: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface PaymentSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface GiftBox {
  id: string;
  title: string;
  price: number;
  original_price: number;
  final_rate: number;
  discount: number;
  image_url: string | null;
  description: string | null;
  features: string[];
  badge: string | null;
  badge_color: string;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useSupabase = () => {
  const { toast } = useToast();

  // Products
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Product[];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
      return [];
    }
  };

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.error('Create product error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      return data as Product;
    } catch (error) {
      console.error('Create product failed:', error);
      toast({
        title: "Error",
        description: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Update product error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      return data as Product;
    } catch (error) {
      console.error('Update product failed:', error);
      toast({
        title: "Error",
        description: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete product error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Delete product failed:', error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  // Orders
  const fetchOrders = async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      return [];
    }
  };

  const updateOrderStatus = async (id: string, status: Order['order_status'], notes?: string): Promise<Order | null> => {
    try {
      const updates: any = { order_status: status };
      if (notes) updates.tracking_notes = notes;
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      return data as Order;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return null;
    }
  };

  // Customers
  const fetchCustomers = async (): Promise<Customer[]> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Customer[];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
      return [];
    }
  };

  // Categories
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return (data || []) as Category[];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
      return [];
    }
  };

  // Site Settings
  const fetchSiteSettings = async (): Promise<SiteSetting[]> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // If no settings found, create default ones
      if (!data || data.length === 0) {
        const defaultSettings = [
          { key: 'site_name', value: 'Hello Crackers', description: 'Website name' },
          { key: 'site_tagline', value: 'Quality Fireworks for Every Celebration', description: 'Website tagline' },
          { key: 'contact_phone', value: '+91 9876543210', description: 'Contact phone number' },
          { key: 'contact_email', value: 'info@hellocrackers.com', description: 'Contact email' },
          { key: 'minimum_order', value: '3000', description: 'Minimum order amount' },
          { key: 'delivery_info', value: 'Free delivery above ₹5000', description: 'Delivery information' },
          { key: 'factory_discount', value: '90', description: 'Factory discount percentage' }
        ];
        
        for (const setting of defaultSettings) {
          await supabase.from('site_settings').insert(setting);
        }
        
        return await fetchSiteSettings();
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return [];
    }
  };

  const updateSiteSetting = async (key: string, value: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .single();
      
      if (error || !data) {
        // Setting doesn't exist, create it
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({ key, value });
        
        if (insertError) throw insertError;
      } else {
        // Setting exists, update it
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        
        if (updateError) throw updateError;
      }
      
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
      return false;
    }
  };

  // Homepage Content
  const fetchHomepageContent = async (): Promise<HomepageContent[]> => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch homepage content",
        variant: "destructive",
      });
      return [];
    }
  };

  const updateHomepageContent = async (sectionName: string, content: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({ section_name: sectionName, content });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Homepage content updated successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update homepage content",
        variant: "destructive",
      });
      return false;
    }
  };

  // Category management
  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      return data as Category;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      return data as Category;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
      return false;
    }
  };

  // File upload
  const uploadFile = async (bucket: string, path: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return { success: true, url: publicData.publicUrl };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return { success: false, url: null };
    }
  };

  // Payment settings functions
  const fetchPaymentSettings = async (): Promise<PaymentSetting[]> => {
    try {
      console.log('Fetching payment settings from Supabase...');
      
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('created_at');
      
      if (error) {
        console.error('Payment settings table error:', error);
        
        // If table doesn't exist, return default settings
        if (error.code === 'PGRST204' || error.message.includes('does not exist') || error.code === '42P01') {
          console.log('Payment settings table does not exist, using defaults');
          return [
            { id: '1', key: 'razorpay_enabled', value: 'false', description: 'Enable Razorpay payment mode', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', key: 'razorpay_key_id', value: '', description: 'Razorpay Key ID', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '3', key: 'razorpay_key_secret', value: '', description: 'Razorpay Key Secret', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '4', key: 'payment_qr_code', value: '', description: 'UPI QR code image URL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '5', key: 'bank_name', value: '', description: 'Bank name for transfers', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '6', key: 'account_number', value: '', description: 'Bank account number', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '7', key: 'ifsc_code', value: '', description: 'Bank IFSC code', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '8', key: 'branch_name', value: '', description: 'Bank branch name', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '9', key: 'payment_instructions', value: 'Please complete your payment using the QR code or bank details provided. Once payment is done, confirmation will be updated by our team.', description: 'Payment instructions for customers', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          ];
        }
        throw error;
      }
      
      // If no settings found, create default ones (table exists but is empty)
      if (!data || data.length === 0) {
        console.log('Payment settings table is empty, creating defaults');
        const defaultSettings = [
          { key: 'razorpay_enabled', value: 'false', description: 'Enable Razorpay payment mode' },
          { key: 'razorpay_key_id', value: '', description: 'Razorpay Key ID' },
          { key: 'razorpay_key_secret', value: '', description: 'Razorpay Key Secret' },
          { key: 'payment_qr_code', value: '', description: 'UPI QR code image URL' },
          { key: 'bank_name', value: '', description: 'Bank name for transfers' },
          { key: 'account_number', value: '', description: 'Bank account number' },
          { key: 'ifsc_code', value: '', description: 'Bank IFSC code' },
          { key: 'branch_name', value: '', description: 'Bank branch name' },
          { key: 'payment_instructions', value: 'Please complete your payment using the QR code or bank details provided. Once payment is done, confirmation will be updated by our team.', description: 'Payment instructions for customers' }
        ];
        
        for (const setting of defaultSettings) {
          await supabase.from('payment_settings').insert(setting);
        }
        
        return await fetchPaymentSettings();
      }
      
      console.log('Payment settings fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast({
        title: "Database Connection Error", 
        description: "Could not access payment settings. Using default values.",
        variant: "destructive",
      });
      
      // Return default settings if database access fails completely
      return [
        { id: '1', key: 'razorpay_enabled', value: 'false', description: 'Enable Razorpay payment mode', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', key: 'razorpay_key_id', value: '', description: 'Razorpay Key ID', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', key: 'razorpay_key_secret', value: '', description: 'Razorpay Key Secret', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', key: 'payment_qr_code', value: '', description: 'UPI QR code image URL', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', key: 'bank_name', value: '', description: 'Bank name for transfers', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', key: 'account_number', value: '', description: 'Bank account number', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '7', key: 'ifsc_code', value: '', description: 'Bank IFSC code', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '8', key: 'branch_name', value: '', description: 'Bank branch name', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '9', key: 'payment_instructions', value: 'Please complete your payment using the QR code or bank details provided. Once payment is done, confirmation will be updated by our team.', description: 'Payment instructions for customers', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ];
    }
  };

  const updatePaymentSetting = async (key: string, value: string): Promise<void> => {
    try {
      console.log(`UpdatePaymentSetting called with: ${key} = ${value}`);
      
      // First check if the table exists and we have permissions
      const { data: tableCheck, error: tableError } = await supabase
        .from('payment_settings')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (tableError) {
        console.error('Payment settings table access error:', tableError);
        throw new Error(`Database table access error: ${tableError.message}`);
      }
      
      console.log('Payment settings table accessible');
      
      const { data, error } = await supabase
        .from('payment_settings')
        .select('id')
        .eq('key', key)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking existing setting:', error);
        throw error;
      }
      
      if (!data) {
        console.log(`Creating new payment setting: ${key}`);
        // Setting doesn't exist, create it
        const { error: insertError } = await supabase
          .from('payment_settings')
          .insert({ key, value });
        
        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        console.log(`Successfully created payment setting: ${key}`);
      } else {
        console.log(`Updating existing payment setting: ${key}`);
        // Setting exists, update it
        const { error: updateError } = await supabase
          .from('payment_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);
        
        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        console.log(`Successfully updated payment setting: ${key}`);
      }
      
      toast({
        title: "Success",
        description: `Payment setting "${key}" updated successfully`,
      });
    } catch (error) {
      console.error('Error updating payment setting:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Payment Setting Update Failed",
        description: `Could not update "${key}": ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrderPaymentStatus = async (id: string, confirmed: boolean, adminNotes?: string): Promise<void> => {
    try {
      const updates: any = { 
        manual_payment_confirmed: confirmed,
        payment_status: confirmed ? 'paid' : 'pending'
      };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: confirmed ? "Payment confirmed successfully" : "Payment status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Bulk operations
  const bulkCreateProducts = async (products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ successCount: number; errorCount: number; errors: string[] }> => {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        // Check if product already exists
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('product_code', product.product_code)
          .single();

        if (existing) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(product)
            .eq('product_code', product.product_code);
          
          if (error) throw error;
        } else {
          // Create new product
          const { error } = await supabase
            .from('products')
            .insert(product);
          
          if (error) throw error;
        }
        
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Error creating product ${product.product_code}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    toast({
      title: successCount > 0 ? "Import Successful" : "Import Failed",
      description: `${successCount} products imported, ${errorCount} errors`,
      variant: errorCount > 0 ? "destructive" : "default"
    });

    return { successCount, errorCount, errors };
  };

  return {
    // Products
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkCreateProducts,
    
    // Orders
    fetchOrders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    
    // Customers
    fetchCustomers,
    
    // Categories
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Site Settings
    fetchSiteSettings,
    updateSiteSetting,
    
    // Homepage Content
    fetchHomepageContent,
    updateHomepageContent,
    
    // Gift Boxes
    fetchGiftBoxes: async (): Promise<GiftBox[]> => {
      try {
        const { data, error } = await supabase
          .from('gift_boxes')
          .select('*')
          .eq('status', 'active')
          .order('display_order', { ascending: true });

        if (error) throw error;
        
        // Transform the data to ensure features is properly typed
        return (data || []).map(item => ({
          ...item,
          features: Array.isArray(item.features) ? item.features.filter(f => typeof f === 'string') : []
        })) as GiftBox[];
      } catch (error) {
        console.error('Error fetching gift boxes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch gift boxes",
          variant: "destructive",
        });
        return [];
      }
    },

    createGiftBox: async (giftBoxData: any): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('gift_boxes')
          .insert(giftBoxData);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Gift box created successfully",
        });
        return true;
      } catch (error) {
        console.error('Error creating gift box:', error);
        toast({
          title: "Error",
          description: "Failed to create gift box",
          variant: "destructive",
        });
        return false;
      }
    },

    updateGiftBox: async (id: string, giftBoxData: any): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('gift_boxes')
          .update(giftBoxData)
          .eq('id', id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Gift box updated successfully",
        });
        return true;
      } catch (error) {
        console.error('Error updating gift box:', error);
        toast({
          title: "Error",
          description: "Failed to update gift box",
          variant: "destructive",
        });
        return false;
      }
    },

    deleteGiftBox: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('gift_boxes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Gift box deleted successfully",
        });
        return true;
      } catch (error) {
        console.error('Error deleting gift box:', error);
        toast({
          title: "Error",
          description: "Failed to delete gift box",
          variant: "destructive",
        });
        return false;
      }
    },
    
    // Payment Settings
    fetchPaymentSettings,
    updatePaymentSetting,
    
    // File upload
    uploadFile,
    
    // Direct supabase access
    supabase,
  };
};