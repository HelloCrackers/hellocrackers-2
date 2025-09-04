-- Temporarily disable RLS for products table to allow mock admin operations
-- This is needed because the app uses mock authentication instead of real Supabase auth

-- Update RLS policies for products to allow anonymous operations for demo purposes
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Create new permissive policies
CREATE POLICY "Allow all operations on products"
  ON public.products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Also update categories table for consistency
DROP POLICY IF EXISTS "Admins can manage all categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;

CREATE POLICY "Allow all operations on categories"
  ON public.categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update site_settings table
DROP POLICY IF EXISTS "Admin can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;

CREATE POLICY "Allow all operations on site_settings"
  ON public.site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update payment_settings table
DROP POLICY IF EXISTS "Admins can manage payment settings" ON public.payment_settings;
DROP POLICY IF EXISTS "Public can view payment settings" ON public.payment_settings;

CREATE POLICY "Allow all operations on payment_settings"
  ON public.payment_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update homepage_content table
DROP POLICY IF EXISTS "Admin can manage homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Public can view homepage content" ON public.homepage_content;

CREATE POLICY "Allow all operations on homepage_content"
  ON public.homepage_content
  FOR ALL
  USING (true)
  WITH CHECK (true);