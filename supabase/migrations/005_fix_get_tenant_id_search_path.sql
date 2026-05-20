-- Fix mutable search_path on get_tenant_id() SECURITY DEFINER function.
-- Without SET search_path = '', a malicious caller could manipulate search_path
-- to shadow system functions before this function executes.
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'tenant_id',
    ''
  );
$$;
