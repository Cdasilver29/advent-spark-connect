-- Add checked_in column to registrations table
ALTER TABLE public.registrations ADD COLUMN checked_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.registrations ADD COLUMN checked_in_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.registrations ADD COLUMN checked_in_by UUID;

-- Add reminder_sent column
ALTER TABLE public.registrations ADD COLUMN reminder_sent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.registrations ADD COLUMN reminder_sent_at TIMESTAMP WITH TIME ZONE;