-- Fix critical security: Remove overly permissive RLS policies on payments table
-- Edge functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS, so they will continue to work

-- Drop the public SELECT policy that exposes all payment data
DROP POLICY IF EXISTS "Allow public payment status check" ON public.payments;

-- Drop the public UPDATE policy that allows anyone to modify payments
DROP POLICY IF EXISTS "Allow payment updates" ON public.payments;

-- Add a restricted SELECT policy - only managers/admins can view payments
CREATE POLICY "Managers can view all payments"
ON public.payments
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));