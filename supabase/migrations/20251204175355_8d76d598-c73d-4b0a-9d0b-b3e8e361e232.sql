-- Create payments table for M-Pesa transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  ticket_type TEXT NOT NULL,
  merchant_request_id TEXT,
  checkout_request_id TEXT,
  mpesa_receipt_number TEXT,
  transaction_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  result_code INTEGER,
  result_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for payment initiation (edge function will handle this)
CREATE POLICY "Allow public payment creation" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

-- Allow public reads for checking payment status
CREATE POLICY "Allow public payment status check" 
ON public.payments 
FOR SELECT 
USING (true);

-- Allow updates for callback processing
CREATE POLICY "Allow payment updates" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();