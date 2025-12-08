-- Create a table to track ticket inventory
CREATE TABLE public.ticket_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_type TEXT NOT NULL UNIQUE,
  max_quantity INTEGER NOT NULL DEFAULT 20,
  sold_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ticket_inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ticket inventory
CREATE POLICY "Anyone can view ticket inventory" 
ON public.ticket_inventory 
FOR SELECT 
USING (true);

-- Insert early bird ticket types with 20 limit each
INSERT INTO public.ticket_inventory (ticket_type, max_quantity, sold_quantity) VALUES
  ('Ages 21-28 (Early Bird)', 20, 0),
  ('Ages 28-40+ (Early Bird)', 20, 0);

-- Create function to increment sold quantity
CREATE OR REPLACE FUNCTION public.increment_ticket_sold(p_ticket_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_sold INTEGER;
  v_max_quantity INTEGER;
BEGIN
  SELECT sold_quantity, max_quantity INTO v_current_sold, v_max_quantity
  FROM public.ticket_inventory
  WHERE ticket_type = p_ticket_type
  FOR UPDATE;
  
  IF v_current_sold IS NULL THEN
    RETURN TRUE; -- Not an early bird ticket, allow purchase
  END IF;
  
  IF v_current_sold >= v_max_quantity THEN
    RETURN FALSE; -- Sold out
  END IF;
  
  UPDATE public.ticket_inventory
  SET sold_quantity = sold_quantity + 1, updated_at = now()
  WHERE ticket_type = p_ticket_type;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-increment when payment is completed
CREATE OR REPLACE FUNCTION public.handle_payment_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM public.increment_ticket_sold(NEW.ticket_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_payment_completed
AFTER INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.handle_payment_completed();