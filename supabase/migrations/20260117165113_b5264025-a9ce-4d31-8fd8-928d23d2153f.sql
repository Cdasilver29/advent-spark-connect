-- Create activities table for managing activity cards
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Users',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Anyone can view active activities
CREATE POLICY "Anyone can view active activities"
ON public.activities
FOR SELECT
USING (is_active = true);

-- Managers can view all activities
CREATE POLICY "Managers can view all activities"
ON public.activities
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can insert activities
CREATE POLICY "Managers can insert activities"
ON public.activities
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can update activities
CREATE POLICY "Managers can update activities"
ON public.activities
FOR UPDATE
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can delete activities
CREATE POLICY "Managers can delete activities"
ON public.activities
FOR DELETE
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for activity images
INSERT INTO storage.buckets (id, name, public) VALUES ('activities', 'activities', true);

-- Storage policies for activities bucket
CREATE POLICY "Anyone can view activity images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'activities');

CREATE POLICY "Managers can upload activity images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'activities' AND
  (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Managers can update activity images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'activities' AND
  (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Managers can delete activity images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'activities' AND
  (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Seed with initial activities
INSERT INTO public.activities (title, description, image_url, icon, display_order) VALUES
('Adventist Community', 'Connect with fellow Adventist singles who share your faith, values, and commitment to Christ-centered relationships.', '/placeholder.svg', 'Users', 1),
('Faith-Centered Dating', 'Experience dating that puts God first, with activities designed to help you grow spiritually together.', '/placeholder.svg', 'Heart', 2),
('Intentional Connections', 'Move beyond surface-level interactions with structured activities that foster meaningful conversations.', '/placeholder.svg', 'MessageCircle', 3),
('Praise & Worship', 'Start with hearts aligned through powerful worship sessions that set the spiritual tone for connections.', '/placeholder.svg', 'Music', 4),
('Fellowship Dinner', 'Share meals and conversations in a warm, family-style setting that encourages genuine fellowship.', '/placeholder.svg', 'Utensils', 5),
('Team Building', 'Engage in fun, collaborative activities that reveal character and compatibility in a relaxed environment.', '/placeholder.svg', 'Users', 6);