-- Fix critical security vulnerability: Customer data exposure in orders table
-- This migration adds proper RLS policies to protect sensitive customer information

-- First, ensure RLS is enabled on the orders table (it should already be, but let's be explicit)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop the existing overly permissive admin policy and recreate it more securely
DROP POLICY IF EXISTS "Admin can manage orders" ON public.orders;

-- Create a secure admin policy that only allows verified admin users to access orders
CREATE POLICY "Verified admins can manage all orders" 
ON public.orders 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
    AND users.email_confirmed_at IS NOT NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
    AND users.email_confirmed_at IS NOT NULL
  )
);

-- Add a deny-all policy for unauthenticated users to explicitly block public access
CREATE POLICY "Deny all public access to orders" 
ON public.orders 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- Add a policy to block authenticated non-admin users from accessing orders
CREATE POLICY "Deny non-admin access to orders" 
ON public.orders 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
    AND users.email_confirmed_at IS NOT NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.uid() = users.id 
    AND (users.raw_user_meta_data ->> 'role'::text) = 'admin'::text
    AND users.email_confirmed_at IS NOT NULL
  )
);