ALTER TABLE public.conteudos ALTER COLUMN user_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.mvp_create_content_v2(
    p_project_id UUID, p_title TEXT, p_description TEXT, p_script_or_copy TEXT,
    p_status TEXT, p_format TEXT, p_platform TEXT, p_priority TEXT,
    p_planned_date DATE, p_published_date DATE, p_drive_url TEXT,
    p_published_url TEXT, p_image_url TEXT, p_notes TEXT
) RETURNS public.conteudos AS $$
DECLARE
    new_content public.conteudos;
BEGIN
    INSERT INTO public.conteudos (
        projeto_id, titulo, description, script_or_copy, status, formato,
        platform, priority, planned_date, data_publicacao, url_midia,
        published_url, image_url, notes, user_id
    )
    VALUES (
        p_project_id, p_title, p_description, p_script_or_copy, p_status, p_format,
        p_platform, p_priority, p_planned_date, p_published_date, p_drive_url,
        p_published_url, p_image_url, p_notes, 
        auth.uid()
    )
    RETURNING * INTO new_content;
    RETURN new_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.mvp_create_content_v2(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, DATE, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;