-- Add explicit security policy to prevent any unauthorized access to customer data
-- This ensures no data leakage even if there are any edge cases in RLS

-- First, let's check current policies and add a stronger security layer
CREATE POLICY "Deny all public access to customers" 
ON public.customers 
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Update the admin policy to be more explicit and secure
DROP POLICY IF EXISTS "Admin can manage customers" ON public.customers;

CREATE POLICY "Only verified admins can access customers" 
ON public.customers 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role') = 'admin'
    AND users.email_confirmed_at IS NOT NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role') = 'admin'
    AND users.email_confirmed_at IS NOT NULL
  )
);