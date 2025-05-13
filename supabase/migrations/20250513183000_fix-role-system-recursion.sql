-- Create a function to check if a user is an admin or superadmin
-- This function runs with SECURITY DEFINER to avoid the RLS policy recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = user_id AND ur.role_id IN (3, 4)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if the current user is an admin or superadmin
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.is_admin_or_superadmin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the problematic policy
DROP POLICY IF EXISTS "User roles can be modified by admins and superadmins" ON public.user_roles;

-- Create a new policy that uses the function instead of directly querying the table
CREATE POLICY "User roles can be modified by admins and superadmins" 
    ON public.user_roles FOR ALL 
    USING (
        public.current_user_is_admin()
    );