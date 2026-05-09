-- Create RPC functions for projects
CREATE OR REPLACE FUNCTION public.mvp_list_projects()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    status TEXT,
    active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.titulo, p.descricao, p.status, true 
    FROM public.projetos p 
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mvp_create_project(p_title TEXT, p_description TEXT, p_status TEXT)
RETURNS public.projetos AS $$
DECLARE
    new_project public.projetos;
BEGIN
    INSERT INTO public.projetos (titulo, descricao, status, user_id)
    VALUES (p_title, p_description, p_status, auth.uid())
    RETURNING * INTO new_project;
    RETURN new_project;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mvp_update_project(p_id UUID, p_title TEXT, p_description TEXT, p_status TEXT)
RETURNS public.projetos AS $$
DECLARE
    updated_project public.projetos;
BEGIN
    UPDATE public.projetos
    SET titulo = p_title,
        descricao = p_description,
        status = p_status,
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO updated_project;
    RETURN updated_project;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mvp_archive_project(p_id UUID)
RETURNS public.projetos AS $$
DECLARE
    archived_project public.projetos;
BEGIN
    UPDATE public.projetos
    SET status = 'archived',
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO archived_project;
    RETURN archived_project;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to anonymous users
GRANT EXECUTE ON FUNCTION public.mvp_list_projects() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_create_project(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_update_project(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_archive_project(UUID) TO anon, authenticated;

-- Also need to make user_id nullable if it's not already
ALTER TABLE public.projetos ALTER COLUMN user_id DROP NOT NULL;