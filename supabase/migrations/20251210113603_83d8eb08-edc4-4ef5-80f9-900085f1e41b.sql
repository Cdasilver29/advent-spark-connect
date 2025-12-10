-- Add email column to payments table for ticket delivery
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS email text;