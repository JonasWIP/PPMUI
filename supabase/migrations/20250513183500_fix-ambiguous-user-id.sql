-- Fix ambiguous column reference in has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = has_role.user_id AND r.name = has_role.role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix is_admin_or_superadmin function to also fully qualify column references
CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = is_admin_or_superadmin.user_id AND ur.role_id IN (3, 4)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;