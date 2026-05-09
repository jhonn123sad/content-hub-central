-- Corrigir avisos de search_path e acesso security definer
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- Restringir execução da função de trigger para que apenas o sistema possa chamar
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
