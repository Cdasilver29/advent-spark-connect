-- Assign manager role to specific email once they sign up
-- This uses a trigger to automatically assign the role when the user is created

CREATE OR REPLACE FUNCTION public.assign_manager_role_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user's email should get manager role
  IF NEW.email = 'calvinedasilver96@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'manager'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to run after profile creation (which happens after auth.users creation)
DROP TRIGGER IF EXISTS on_profile_created_assign_manager ON public.profiles;
CREATE TRIGGER on_profile_created_assign_manager
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_manager_role_on_signup();

-- Also insert the role now if the user already exists
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'manager'::app_role
FROM public.profiles p
WHERE p.email = 'calvinedasilver96@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;