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
  order_status: 'confirmed' | 'factory' | 'dispatched' | 'transport' | 'delivered' | 'cancelled';
  tracking_notes?: string;
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
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      return data as Product;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
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
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      return data as Product;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
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
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
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
      return data || [];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch site settings",
        variant: "destructive",
      });
      return [];
    }
  };

  const updateSiteSetting = async (key: string, value: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      
      if (error) throw error;
      
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

  return {
    // Products
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Orders
    fetchOrders,
    updateOrderStatus,
    
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
    
    // File upload
    uploadFile,
    
    // Direct supabase access
    supabase,
  };
};