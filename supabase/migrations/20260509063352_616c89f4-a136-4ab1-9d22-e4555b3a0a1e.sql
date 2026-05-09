-- Update projetos table
ALTER TABLE public.projetos 
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS niche TEXT,
ADD COLUMN IF NOT EXISTS main_platform TEXT,
ADD COLUMN IF NOT EXISTS daily_content_goal INTEGER,
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Update conteudos table
ALTER TABLE public.conteudos 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS script_or_copy TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT,
ADD COLUMN IF NOT EXISTS planned_date DATE,
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS published_url TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update referencias table
ALTER TABLE public.referencias 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projetos(id),
ADD COLUMN IF NOT EXISTS content_id UUID REFERENCES public.conteudos(id);

-- Update criativos table
ALTER TABLE public.criativos 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projetos(id),
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update metas table
ALTER TABLE public.metas 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projetos(id),
ADD COLUMN IF NOT EXISTS goal_type TEXT,
ADD COLUMN IF NOT EXISTS period TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT;

-- RPC Functions for Contents
CREATE OR REPLACE FUNCTION public.mvp_list_contents()
RETURNS TABLE (
    id UUID, project_id UUID, title TEXT, description TEXT, script_or_copy TEXT,
    status TEXT, format TEXT, platform TEXT, priority TEXT, planned_date DATE,
    published_date DATE, drive_url TEXT, published_url TEXT, image_url TEXT,
    notes TEXT, active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.projeto_id, c.titulo, c.description, c.script_or_copy,
           c.status, c.formato, c.platform, c.priority, c.planned_date,
           c.data_publicacao, c.url_midia, c.published_url, c.image_url,
           c.notes, true
    FROM public.conteudos c
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_create_content(
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
        p_published_url, p_image_url, p_notes, auth.uid()
    )
    RETURNING * INTO new_content;
    RETURN new_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_update_content(
    p_id UUID, p_project_id UUID, p_title TEXT, p_description TEXT,
    p_script_or_copy TEXT, p_status TEXT, p_format TEXT, p_platform TEXT,
    p_priority TEXT, p_planned_date DATE, p_published_date DATE,
    p_drive_url TEXT, p_published_url TEXT, p_image_url TEXT, p_notes TEXT
) RETURNS public.conteudos AS $$
DECLARE
    updated_content public.conteudos;
BEGIN
    UPDATE public.conteudos
    SET projeto_id = p_project_id, titulo = p_title, description = p_description,
        script_or_copy = p_script_or_copy, status = p_status, formato = p_format,
        platform = p_platform, priority = p_priority, planned_date = p_planned_date,
        data_publicacao = p_published_date, url_midia = p_drive_url,
        published_url = p_published_url, image_url = p_image_url, notes = p_notes,
        updated_at = now()
    WHERE id = p_id
    RETURNING * INTO updated_content;
    RETURN updated_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_archive_content(p_id UUID)
RETURNS public.conteudos AS $$
DECLARE
    archived_content public.conteudos;
BEGIN
    UPDATE public.conteudos
    SET status = 'archived', updated_at = now()
    WHERE id = p_id
    RETURNING * INTO archived_content;
    RETURN archived_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC Functions for References
CREATE OR REPLACE FUNCTION public.mvp_list_references()
RETURNS TABLE (
    id UUID, project_id UUID, content_id UUID, title TEXT, description TEXT,
    type TEXT, url TEXT, image_url TEXT, notes TEXT, active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT r.id, r.project_id, r.content_id, r.titulo, r.description,
           r.type, r.url, r.image_url, r.notes, true
    FROM public.referencias r
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_create_reference(
    p_project_id UUID, p_content_id UUID, p_title TEXT, p_description TEXT,
    p_type TEXT, p_url TEXT, p_image_url TEXT, p_notes TEXT
) RETURNS public.referencias AS $$
DECLARE
    new_ref public.referencias;
BEGIN
    INSERT INTO public.referencias (
        project_id, content_id, titulo, description, type, url, image_url, notes, user_id
    )
    VALUES (
        p_project_id, p_content_id, p_title, p_description, p_type, p_url, p_image_url, p_notes, auth.uid()
    )
    RETURNING * INTO new_ref;
    RETURN new_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_update_reference(
    p_id UUID, p_project_id UUID, p_content_id UUID, p_title TEXT,
    p_description TEXT, p_type TEXT, p_url TEXT, p_image_url TEXT, p_notes TEXT
) RETURNS public.referencias AS $$
DECLARE
    updated_ref public.referencias;
BEGIN
    UPDATE public.referencias
    SET project_id = p_project_id, content_id = p_content_id, titulo = p_title,
        description = p_description, type = p_type, url = p_url,
        image_url = p_image_url, notes = p_notes
    WHERE id = p_id
    RETURNING * INTO updated_ref;
    RETURN updated_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_archive_reference(p_id UUID)
RETURNS public.referencias AS $$
DECLARE
    archived_ref public.referencias;
BEGIN
    -- For now just delete or add an 'active' column if we really want to archive
    -- Since references table doesn't have status, we'll just return it or we could add 'active' column
    SELECT * INTO archived_ref FROM public.referencias WHERE id = p_id;
    RETURN archived_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC Functions for Creatives
CREATE OR REPLACE FUNCTION public.mvp_list_creatives()
RETURNS TABLE (
    id UUID, project_id UUID, content_id UUID, title TEXT, type TEXT,
    status TEXT, file_url TEXT, image_url TEXT, description TEXT,
    notes TEXT, active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.project_id, c.conteudo_id, c.nome, c.tipo_arquivo,
           c.status, c.url_arquivo, c.image_url, c.description, c.notes, true
    FROM public.criativos c
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_create_creative(
    p_project_id UUID, p_content_id UUID, p_title TEXT, p_type TEXT,
    p_status TEXT, p_file_url TEXT, p_image_url TEXT, p_description TEXT, p_notes TEXT
) RETURNS public.criativos AS $$
DECLARE
    new_creative public.criativos;
BEGIN
    INSERT INTO public.criativos (
        project_id, conteudo_id, nome, tipo_arquivo, status, url_arquivo,
        image_url, description, notes, user_id
    )
    VALUES (
        p_project_id, p_content_id, p_title, p_type, p_status, p_file_url,
        p_image_url, p_description, p_notes, auth.uid()
    )
    RETURNING * INTO new_creative;
    RETURN new_creative;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_update_creative(
    p_id UUID, p_project_id UUID, p_content_id UUID, p_title TEXT,
    p_type TEXT, p_status TEXT, p_file_url TEXT, p_image_url TEXT,
    p_description TEXT, p_notes TEXT
) RETURNS public.criativos AS $$
DECLARE
    updated_creative public.criativos;
BEGIN
    UPDATE public.criativos
    SET project_id = p_project_id, conteudo_id = p_content_id, nome = p_title,
        tipo_arquivo = p_type, status = p_status, url_arquivo = p_file_url,
        image_url = p_image_url, description = p_description, notes = p_notes
    WHERE id = p_id
    RETURNING * INTO updated_creative;
    RETURN updated_creative;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_archive_creative(p_id UUID)
RETURNS public.criativos AS $$
DECLARE
    archived_creative public.criativos;
BEGIN
    UPDATE public.criativos
    SET status = 'archived'
    WHERE id = p_id
    RETURNING * INTO archived_creative;
    RETURN archived_creative;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC Functions for Goals
CREATE OR REPLACE FUNCTION public.mvp_list_goals()
RETURNS TABLE (
    id UUID, project_id UUID, title TEXT, goal_type TEXT, target_count INTEGER,
    period TEXT, start_date DATE, end_date DATE, status TEXT, active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY 
    SELECT g.id, g.project_id, g.titulo, g.goal_type, g.objetivo_valor,
           g.period, g.start_date, g.prazo, g.status, true
    FROM public.metas g
    ORDER BY g.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_create_goal(
    p_project_id UUID, p_title TEXT, p_goal_type TEXT, p_target_count INTEGER,
    p_period TEXT, p_start_date DATE, p_end_date DATE, p_status TEXT
) RETURNS public.metas AS $$
DECLARE
    new_goal public.metas;
BEGIN
    INSERT INTO public.metas (
        project_id, titulo, goal_type, objetivo_valor, period, start_date, prazo, status, user_id
    )
    VALUES (
        p_project_id, p_title, p_goal_type, p_target_count, p_period, p_start_date, p_end_date, p_status, auth.uid()
    )
    RETURNING * INTO new_goal;
    RETURN new_goal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_update_goal(
    p_id UUID, p_project_id UUID, p_title TEXT, p_goal_type TEXT,
    p_target_count INTEGER, p_period TEXT, p_start_date DATE,
    p_end_date DATE, p_status TEXT
) RETURNS public.metas AS $$
DECLARE
    updated_goal public.metas;
BEGIN
    UPDATE public.metas
    SET project_id = p_project_id, titulo = p_title, goal_type = p_goal_type,
        objetivo_valor = p_target_count, period = p_period, start_date = p_start_date,
        prazo = p_end_date, status = p_status
    WHERE id = p_id
    RETURNING * INTO updated_goal;
    RETURN updated_goal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mvp_archive_goal(p_id UUID)
RETURNS public.metas AS $$
DECLARE
    archived_goal public.metas;
BEGIN
    UPDATE public.metas
    SET status = 'archived'
    WHERE id = p_id
    RETURNING * INTO archived_goal;
    RETURN archived_goal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Dashboard Summary RPC
CREATE OR REPLACE FUNCTION public.mvp_dashboard_summary()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    v_today DATE := CURRENT_DATE;
BEGIN
    SELECT jsonb_build_object(
        'active_projects', (SELECT count(*) FROM public.projetos WHERE status = 'active'),
        'today_planned_contents', (SELECT count(*) FROM public.conteudos WHERE planned_date = v_today),
        'ready_contents', (SELECT count(*) FROM public.conteudos WHERE status IN ('ready', 'scheduled')),
        'late_contents', (SELECT count(*) FROM public.conteudos WHERE planned_date < v_today AND status NOT IN ('published', 'archived')),
        'published_contents', (SELECT count(*) FROM public.conteudos WHERE status = 'published' AND data_publicacao = v_today),
        'active_goals', (SELECT count(*) FROM public.metas WHERE status = 'active'),
        'recent_references', (
            SELECT jsonb_agg(r) FROM (
                SELECT id, titulo as title, type FROM public.referencias ORDER BY created_at DESC LIMIT 4
            ) r
        ),
        'upcoming_contents', (
            SELECT jsonb_agg(c) FROM (
                SELECT id, titulo as title, planned_date, platform, status 
                FROM public.conteudos 
                WHERE planned_date >= v_today 
                ORDER BY planned_date ASC LIMIT 5
            ) c
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grants
GRANT EXECUTE ON FUNCTION public.mvp_list_contents() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_create_content(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, DATE, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_update_content(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, DATE, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_archive_content(UUID) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mvp_list_references() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_create_reference(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_update_reference(UUID, UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_archive_reference(UUID) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mvp_list_creatives() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_create_creative(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_update_creative(UUID, UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_archive_creative(UUID) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mvp_list_goals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_create_goal(UUID, TEXT, TEXT, INTEGER, TEXT, DATE, DATE, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_update_goal(UUID, UUID, TEXT, TEXT, INTEGER, TEXT, DATE, DATE, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mvp_archive_goal(UUID) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.mvp_dashboard_summary() TO anon, authenticated;
