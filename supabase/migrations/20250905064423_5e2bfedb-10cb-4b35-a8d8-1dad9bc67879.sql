-- Fix critical security vulnerability: Restrict payment_settings access to admin users only
-- Drop the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow all operations on payment_settings" ON public.payment_settings;

-- Create secure RLS policies that only allow verified admin users to access payment settings
CREATE POLICY "Only verified admins can read payment settings" 
ON public.payment_settings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM auth.users 
  WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text 
    AND users.email_confirmed_at IS NOT NULL
));

CREATE POLICY "Only verified admins can modify payment settings" 
ON public.payment_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 
  FROM auth.users 
  WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text 
    AND users.email_confirmed_at IS NOT NULL
)) 
WITH CHECK (EXISTS (
  SELECT 1 
  FROM auth.users 
  WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text 
    AND users.email_confirmed_at IS NOT NULL
));