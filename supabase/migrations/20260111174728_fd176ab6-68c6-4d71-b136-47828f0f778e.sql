-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can check registration code" ON public.payments;

-- Create a more restrictive policy that only allows checking registration codes
-- This policy requires the client to provide a specific registration code in the query
-- and only returns minimal data (just the existence check)
-- Note: For actual registration code verification, we'll use an edge function with service role
-- that doesn't expose sensitive data

-- For public users: No direct SELECT access to payments table
-- Registration code verification should be done through an edge function