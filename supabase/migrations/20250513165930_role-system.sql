-- Create roles table
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles junction table
CREATE TABLE public.user_roles (
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES public.roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO public.roles (id, name, description) VALUES
    (1, 'user', 'Basic user with limited access'),
    (2, 'member', 'Member with access to create and manage their own content'),
    (3, 'admin', 'Administrator with enhanced access to manage users and content'),
    (4, 'superadmin', 'Super administrator with full system access');

-- Add RLS policies for roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are viewable by all authenticated users" 
    ON public.roles FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Roles can only be modified by superadmins" 
    ON public.roles FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role_id = 4
        )
    );

-- Add RLS policies for user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User roles are viewable by all authenticated users" 
    ON public.user_roles FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "User roles can be modified by admins and superadmins" 
    ON public.user_roles FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role_id IN (3, 4)
        )
    );

-- Create function to assign default role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to assign default role when a user profile is created
CREATE TRIGGER assign_user_role_on_profile_creation
AFTER INSERT ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.assign_default_role();

-- Create function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id AND r.name = role_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if current user has a specific role
CREATE OR REPLACE FUNCTION public.current_user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role(auth.uid(), role_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;