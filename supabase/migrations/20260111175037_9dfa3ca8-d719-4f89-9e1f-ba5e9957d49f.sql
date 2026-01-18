-- Fix overly permissive INSERT policies on payments and registrations tables
-- These tables need public insert but with additional validation

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow public payment creation" ON public.payments;
DROP POLICY IF EXISTS "Allow public registration creation" ON public.registrations;

-- Create more restrictive INSERT policies with basic validation
-- Payments: Allow public insert but only with required fields
CREATE POLICY "Allow public payment creation with validation" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  phone_number IS NOT NULL 
  AND amount IS NOT NULL 
  AND amount > 0 
  AND ticket_type IS NOT NULL
  AND status = 'pending'
);

-- Registrations: Allow public insert with required fields validation
CREATE POLICY "Allow public registration creation with validation" 
ON public.registrations 
FOR INSERT 
WITH CHECK (
  registration_code IS NOT NULL 
  AND email IS NOT NULL 
  AND full_name IS NOT NULL 
  AND phone IS NOT NULL
  AND church_name IS NOT NULL
  AND church_district IS NOT NULL
  AND age_group IS NOT NULL
);

-- Also fix audit_logs if it has true policy
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.audit_logs;

-- Create a more restrictive audit log policy
-- Only allow inserts with required fields
CREATE POLICY "Allow audit log creation with validation" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (
  user_id IS NOT NULL 
  AND resource_type IS NOT NULL 
  AND action IS NOT NULL
);