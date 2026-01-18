-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  quote TEXT NOT NULL,
  highlight TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view active testimonials
CREATE POLICY "Anyone can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

-- Managers can view all testimonials
CREATE POLICY "Managers can view all testimonials" 
ON public.testimonials 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can insert testimonials
CREATE POLICY "Managers can insert testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can update testimonials
CREATE POLICY "Managers can update testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can delete testimonials
CREATE POLICY "Managers can delete testimonials" 
ON public.testimonials 
FOR DELETE 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create FAQs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Anyone can view active FAQs
CREATE POLICY "Anyone can view active FAQs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

-- Managers can view all FAQs
CREATE POLICY "Managers can view all FAQs" 
ON public.faqs 
FOR SELECT 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can insert FAQs
CREATE POLICY "Managers can insert FAQs" 
ON public.faqs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can update FAQs
CREATE POLICY "Managers can update FAQs" 
ON public.faqs 
FOR UPDATE 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Managers can delete FAQs
CREATE POLICY "Managers can delete FAQs" 
ON public.faqs 
FOR DELETE 
USING (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Insert initial testimonials data
INSERT INTO public.testimonials (name, location, quote, highlight, display_order) VALUES
('Grace M.', 'Nairobi', 'Singles Spark was a blessing! I came expecting fellowship but left with lifelong friends who share my faith. The activities were so thoughtfully designed to help us connect genuinely.', 'Found lifelong friends', 1),
('David K.', 'Mombasa', 'As a young Adventist professional, finding like-minded singles was challenging. This event changed everything. The Christ-centered approach made all the difference.', 'Christ-centered connections', 2),
('Sarah N.', 'Kisumu', 'I met my best friend at Singles Spark last year. The team building activities and worship sessions created such a warm, welcoming atmosphere. Can''t wait for this year!', 'Met my best friend', 3),
('James O.', 'Eldoret', 'The purposeful fellowship approach is what sets this apart. It''s not just about meeting people—it''s about growing together in faith while forming meaningful relationships.', 'Purposeful fellowship', 4);

-- Insert initial FAQs data
INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('Who can attend Singles Spark?', 'Singles Spark is open to all Seventh-day Adventist singles aged 21 and above who are seeking meaningful, faith-centered connections. Whether you''re looking for friendship, networking, or a life partner, you''re welcome!', 'Eligibility', 1),
('What should I wear to the event?', 'The dress code is smart casual. Please dress modestly and appropriately as befitting an Adventist gathering. Avoid overly casual attire like shorts or flip-flops.', 'Event Details', 2),
('Is food provided at the event?', 'Yes! We provide a vegetarian lunch and refreshments throughout the event. Please indicate any dietary requirements (vegan, gluten-free, allergies) during registration.', 'Event Details', 3),
('How does the matching process work?', 'Our activities are designed to help you meet multiple people in a comfortable, faith-centered environment. There''s no pressure—connections happen naturally through team activities, discussions, and fellowship.', 'Activities', 4),
('Can I get a refund if I can''t attend?', 'Refunds are available up to 7 days before the event. After that, your ticket can be transferred to another eligible attendee. Please contact us for assistance.', 'Tickets', 5),
('Is this event only for people looking for marriage?', 'Not at all! While some attendees may be seeking a life partner, many come for fellowship, networking, and building friendships with like-minded Adventists. All are welcome.', 'General', 6),
('What COVID-19 measures are in place?', 'We follow current health guidelines and venue requirements. Hand sanitizers will be available, and we encourage anyone feeling unwell to stay home. Your health and safety are our priority.', 'Health & Safety', 7),
('How can I volunteer or help organize?', 'We welcome volunteers! Please reach out through our contact form or social media. Volunteers receive discounted tickets and the blessing of serving our community.', 'General', 8);