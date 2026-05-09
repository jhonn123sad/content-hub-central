ALTER FUNCTION public.mvp_list_projects() SET search_path = public;
ALTER FUNCTION public.mvp_create_project(TEXT, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.mvp_update_project(UUID, TEXT, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.mvp_archive_project(UUID) SET search_path = public;