-- Fix RLS policies for products and categories tables and add payment management features

-- Drop existing problematic policies on products table
DROP POLICY IF EXISTS "Authenticated users can view all products" ON public.products;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Create new secure policies for products
CREATE POLICY "Public can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can manage all products" 
ON public.products 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
);

-- Fix categories policies
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;

CREATE POLICY "Public can view active categories" 
ON public.categories 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can manage all categories" 
ON public.categories 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
);

-- Create payment settings table for manual payment options
CREATE TABLE public.payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payment_settings
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for payment settings
CREATE POLICY "Public can view payment settings" 
ON public.payment_settings 
FOR SELECT 
USING (key NOT LIKE 'admin_%');

CREATE POLICY "Admins can manage payment settings" 
ON public.payment_settings 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
  )
);

-- Insert default payment settings
INSERT INTO public.payment_settings (key, value, description) VALUES 
('razorpay_enabled', 'false', 'Enable/Disable Razorpay manual payment mode'),
('payment_qr_code', '', 'UPI Payment QR Code URL'),
('bank_name', '', 'Bank Name for Direct Transfer'),
('account_number', '', 'Bank Account Number'),
('ifsc_code', '', 'Bank IFSC Code'),
('branch_name', '', 'Bank Branch Name'),
('payment_instructions', 'Please complete your payment using the QR code or bank details provided. Once payment is done, confirmation will be updated by our team.', 'Payment instructions for customers');

-- Update orders table to support manual payment confirmation
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS manual_payment_confirmed BOOLEAN DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add trigger for updating timestamp on payment_settings
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON public.payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.payment_settings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.products;
ALTER publication supabase_realtime ADD TABLE public.categories;
ALTER publication supabase_realtime ADD TABLE public.orders;
ALTER publication supabase_realtime ADD TABLE public.payment_settings;