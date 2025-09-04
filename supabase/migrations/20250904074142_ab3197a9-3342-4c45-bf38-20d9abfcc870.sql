-- Create gift_boxes table for managing homepage gift box offers
CREATE TABLE public.gift_boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  final_rate NUMERIC GENERATED ALWAYS AS (ROUND(price, 0)) STORED,
  discount NUMERIC GENERATED ALWAYS AS (ROUND((1 - price / original_price) * 100, 0)) STORED,
  image_url TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  badge_color TEXT DEFAULT 'bg-brand-gold text-black',
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies for gift boxes
CREATE POLICY "Gift boxes are viewable by everyone" 
ON public.gift_boxes 
FOR SELECT 
USING (true);

CREATE POLICY "Only verified admins can manage gift boxes" 
ON public.gift_boxes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = users.id 
  AND (users.raw_user_meta_data ->> 'role')::text = 'admin' 
  AND users.email_confirmed_at IS NOT NULL
))
WITH CHECK (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = users.id 
  AND (users.raw_user_meta_data ->> 'role')::text = 'admin' 
  AND users.email_confirmed_at IS NOT NULL
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gift_boxes_updated_at
BEFORE UPDATE ON public.gift_boxes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default gift boxes
INSERT INTO public.gift_boxes (title, price, original_price, image_url, description, features, badge, badge_color, display_order) VALUES
('₹1,000 Gift Box', 1000, 2500, '/src/assets/gift-box-1000.jpg', 'Perfect starter pack for small celebrations', '["Family-friendly crackers", "Sparklers included", "Safe for kids", "Free delivery"]', 'Popular', 'bg-brand-gold text-black', 1),
('₹3,000 Gift Box', 3000, 7500, '/src/assets/gift-box-3000.jpg', 'Complete celebration package for the whole family', '["Premium assorted crackers", "Fancy fireworks", "Ground chakras", "Aerial shots"]', 'Best Value', 'bg-brand-red text-white', 2),
('₹5,000 Gift Box', 5000, 12500, '/src/assets/gift-box-5000.jpg', 'Luxury celebration box for grand festivities', '["Deluxe cracker collection", "Professional grade", "Sky shots included", "Premium packaging"]', 'Premium', 'bg-brand-purple text-white', 3);