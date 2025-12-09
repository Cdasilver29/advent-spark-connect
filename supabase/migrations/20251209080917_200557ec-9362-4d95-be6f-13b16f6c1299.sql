-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create event_details table for editable event info
CREATE TABLE public.event_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date text NOT NULL DEFAULT 'Coming Soon',
  event_time text NOT NULL DEFAULT '1:00 PM - 7:00 PM',
  venue text NOT NULL DEFAULT 'To Be Announced',
  dress_code text NOT NULL DEFAULT 'Smart Casual',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.event_details ENABLE ROW LEVEL SECURITY;

-- Anyone can view event details
CREATE POLICY "Anyone can view event details"
ON public.event_details
FOR SELECT
USING (true);

-- Only managers/admins can update event details
CREATE POLICY "Managers can update event details"
ON public.event_details
FOR UPDATE
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can insert event details"
ON public.event_details
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Insert default event details
INSERT INTO public.event_details (event_date, event_time, venue, dress_code)
VALUES ('Coming Soon', '1:00 PM - 7:00 PM', 'To Be Announced', 'Smart Casual');

-- Create event_flyers table
CREATE TABLE public.event_flyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  event_date text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.event_flyers ENABLE ROW LEVEL SECURITY;

-- Anyone can view active flyers
CREATE POLICY "Anyone can view active flyers"
ON public.event_flyers
FOR SELECT
USING (is_active = true);

-- Managers can manage flyers
CREATE POLICY "Managers can insert flyers"
ON public.event_flyers
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can update flyers"
ON public.event_flyers
FOR UPDATE
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can delete flyers"
ON public.event_flyers
FOR DELETE
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Managers can view all flyers
CREATE POLICY "Managers can view all flyers"
ON public.event_flyers
FOR SELECT
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create social_links table
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view active social links
CREATE POLICY "Anyone can view active social links"
ON public.social_links
FOR SELECT
USING (is_active = true);

-- Managers can manage social links
CREATE POLICY "Managers can insert social links"
ON public.social_links
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can update social links"
ON public.social_links
FOR UPDATE
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can delete social links"
ON public.social_links
FOR DELETE
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all social links"
ON public.social_links
FOR SELECT
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for flyers
INSERT INTO storage.buckets (id, name, public) VALUES ('flyers', 'flyers', true);

-- Storage policies for flyers bucket
CREATE POLICY "Anyone can view flyers"
ON storage.objects
FOR SELECT
USING (bucket_id = 'flyers');

CREATE POLICY "Managers can upload flyers"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'flyers' AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Managers can update flyers"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'flyers' AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Managers can delete flyers"
ON storage.objects
FOR DELETE
USING (bucket_id = 'flyers' AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));