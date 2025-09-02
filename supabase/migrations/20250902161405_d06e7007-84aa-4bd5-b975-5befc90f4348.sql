-- Create comprehensive admin system with CMS functionality

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_code TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT,
  user_for TEXT NOT NULL CHECK (user_for IN ('Family', 'Adult', 'Kids')),
  mrp DECIMAL(10,2) NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  final_rate DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  video_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  challan_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (order_status IN ('confirmed', 'factory', 'dispatched', 'transport', 'delivered', 'cancelled')),
  tracking_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create homepage_content table for CMS
CREATE TABLE public.homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challan_templates table
CREATE TABLE public.challan_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('products', 'products', true),
  ('content', 'content', true),
  ('documents', 'documents', false);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challan_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - Admin can do everything, public can only read some data
-- Products policies
CREATE POLICY "Public can view active products" 
  ON public.products FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admin can manage products" 
  ON public.products FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Orders policies
CREATE POLICY "Admin can manage orders" 
  ON public.orders FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Customers policies
CREATE POLICY "Admin can manage customers" 
  ON public.customers FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Categories policies
CREATE POLICY "Public can view active categories" 
  ON public.categories FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admin can manage categories" 
  ON public.categories FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Homepage content policies
CREATE POLICY "Public can view homepage content" 
  ON public.homepage_content FOR SELECT 
  USING (true);

CREATE POLICY "Admin can manage homepage content" 
  ON public.homepage_content FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Site settings policies
CREATE POLICY "Public can view public site settings" 
  ON public.site_settings FOR SELECT 
  USING (key NOT LIKE 'admin_%');

CREATE POLICY "Admin can manage site settings" 
  ON public.site_settings FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Challan templates policies
CREATE POLICY "Admin can manage challan templates" 
  ON public.challan_templates FOR ALL 
  USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Storage policies for admin file uploads
CREATE POLICY "Admin can upload product images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'products' AND EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Public can view product images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'products');

CREATE POLICY "Admin can upload content" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'content' AND EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Public can view content" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'content');

CREATE POLICY "Admin can manage documents" 
  ON storage.objects FOR ALL 
  USING (bucket_id = 'documents' AND EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.categories (name, description, display_order) VALUES
  ('Fancy Crackers', 'Premium fancy crackers for all occasions', 1),
  ('Bijili Crackers', 'High sound crackers for adults', 2),
  ('Sparklers', 'Safe sparklers for kids and family', 3),
  ('Twinkling Star', 'Beautiful twinkling star crackers', 4),
  ('Ground Chakra', 'Ground spinning crackers', 5);

INSERT INTO public.products (product_code, product_name, category, user_for, mrp, discount, final_rate, stock, description) VALUES
  ('H001', 'Flower Pots Deluxe', 'Fancy Crackers', 'Family', 500.00, 90, 50.00, 1000, 'Beautiful flower pot crackers'),
  ('H002', 'Atom Bomb Premium', 'Bijili Crackers', 'Adult', 1000.00, 90, 100.00, 500, 'High sound atom bomb crackers'),
  ('H003', 'Safe Sparklers', 'Sparklers', 'Kids', 200.00, 90, 20.00, 2000, 'Safe sparklers for children'),
  ('H004', 'Twinkling Star Special', 'Twinkling Star', 'Adult', 800.00, 90, 80.00, 800, 'Premium twinkling star crackers'),
  ('H005', 'Ground Chakra Mega', 'Ground Chakra', 'Family', 600.00, 90, 60.00, 600, 'Large ground spinning chakra');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', 'Hello Crackers', 'Website name'),
  ('site_tagline', 'Premium Crackers Direct from Factory', 'Website tagline'),
  ('contact_phone', '9042191018', 'Primary contact phone'),
  ('contact_email', 'hello@hellocrackers.com', 'Primary contact email'),
  ('minimum_order', '3000', 'Minimum order amount'),
  ('delivery_info', 'Free delivery across Tamil Nadu', 'Delivery information'),
  ('factory_discount', '90', 'Factory direct discount percentage');

-- Insert default homepage content
INSERT INTO public.homepage_content (section_name, content) VALUES
  ('hero_section', '{"title": "Hello Crackers", "subtitle": "Premium Crackers Direct from Factory", "image": "/assets/hello-crackers-branded.png"}'),
  ('features', '{"items": [{"title": "90% OFF", "description": "Direct Factory Prices"}, {"title": "Free Delivery", "description": "Across Tamil Nadu"}, {"title": "Premium Quality", "description": "Best Quality Guaranteed"}]}'),
  ('footer', '{"company_info": {"name": "Hello Crackers", "address": "Tamil Nadu, India", "phone": "9042191018", "email": "hello@hellocrackers.com"}, "social_links": {"facebook": "", "instagram": "", "youtube": ""}}');

-- Insert default challan template
INSERT INTO public.challan_templates (name, template_data, is_default) VALUES
  ('Default Challan', '{"header": {"company_name": "Hello Crackers", "logo": "/assets/hello-crackers-logo.jpg"}, "colors": {"primary": "#ff6b35", "secondary": "#ffa500"}, "layout": "standard"}', true);