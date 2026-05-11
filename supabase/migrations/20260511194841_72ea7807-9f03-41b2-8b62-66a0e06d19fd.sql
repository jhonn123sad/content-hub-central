-- 1. Rename Tables
ALTER TABLE IF EXISTS public.projetos RENAME TO projects;
ALTER TABLE IF EXISTS public.conteudos RENAME TO contents;
ALTER TABLE IF EXISTS public.referencias RENAME TO "references";
ALTER TABLE IF EXISTS public.criativos RENAME TO creatives;
ALTER TABLE IF EXISTS public.metas RENAME TO goals;

-- 2. Rename Columns for projects
ALTER TABLE public.projects RENAME COLUMN titulo TO title;
ALTER TABLE public.projects RENAME COLUMN descricao TO description;

-- 3. Rename Columns for contents
ALTER TABLE public.contents RENAME COLUMN titulo TO title;
ALTER TABLE public.contents RENAME COLUMN projeto_id TO project_id;
ALTER TABLE public.contents RENAME COLUMN formato TO format;
ALTER TABLE public.contents RENAME COLUMN data_publicacao TO published_date;
ALTER TABLE public.contents RENAME COLUMN url_midia TO old_url_midia;

-- 4. Rename Columns for references
ALTER TABLE public."references" RENAME COLUMN titulo TO title;

-- 5. Rename Columns for creatives
ALTER TABLE public.creatives RENAME COLUMN nome TO title;
ALTER TABLE public.creatives RENAME COLUMN conteudo_id TO content_id;
ALTER TABLE public.creatives RENAME COLUMN url_arquivo TO file_url;
ALTER TABLE public.creatives RENAME COLUMN tipo_arquivo TO type;

-- 6. Rename Columns for goals
ALTER TABLE public.goals RENAME COLUMN titulo TO title;
ALTER TABLE public.goals RENAME COLUMN objetivo_valor TO target_count;
ALTER TABLE public.goals RENAME COLUMN progresso_valor TO current_count;
ALTER TABLE public.goals RENAME COLUMN prazo TO end_date;

-- 7. Drop and Re-create RPC functions
DROP FUNCTION IF EXISTS public.mvp_dashboard_summary();
CREATE OR REPLACE FUNCTION public.mvp_dashboard_summary()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    result JSONB;
    v_today DATE := CURRENT_DATE;
BEGIN
    SELECT jsonb_build_object(
        'active_projects', (SELECT count(*) FROM public.projects WHERE status = 'active'),
        'today_planned_contents', (SELECT count(*) FROM public.contents WHERE planned_date = v_today),
        'ready_contents', (SELECT count(*) FROM public.contents WHERE status IN ('ready', 'scheduled')),
        'late_contents', (SELECT count(*) FROM public.contents WHERE planned_date < v_today AND status NOT IN ('published', 'archived')),
        'published_contents', (SELECT count(*) FROM public.contents WHERE status = 'published' AND published_date = v_today),
        'active_goals', (SELECT count(*) FROM public.goals WHERE status = 'active'),
        'recent_references', (
            SELECT COALESCE(jsonb_agg(r), '[]'::jsonb) FROM (
                SELECT id, title, type FROM public."references" ORDER BY created_at DESC LIMIT 4
            ) r
        ),
        'upcoming_contents', (
            SELECT COALESCE(jsonb_agg(c), '[]'::jsonb) FROM (
                SELECT id, title, planned_date, platform, status 
                FROM public.contents 
                WHERE planned_date >= v_today 
                ORDER BY planned_date ASC LIMIT 5
            ) c
        )
    ) INTO result;
    
    RETURN result;
END;
$function$;

-- Projects
CREATE OR REPLACE FUNCTION public.mvp_list_projects()
 RETURNS TABLE(id uuid, title text, description text, status text, active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.title, p.description, p.status, true 
    FROM public.projects p 
    ORDER BY p.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mvp_create_project(p_title text, p_description text, p_status text)
 RETURNS public.projects
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_project public.projects;
BEGIN
    INSERT INTO public.projects (title, description, status, user_id)
    VALUES (p_title, p_description, p_status, auth.uid())
    RETURNING * INTO new_project;
    RETURN new_project;
END;
$function$;

-- Contents
CREATE OR REPLACE FUNCTION public.mvp_list_contents()
 RETURNS TABLE(id uuid, project_id uuid, title text, description text, script_or_copy text, status text, format text, platform text, priority text, planned_date date, published_date date, drive_url text, published_url text, image_url text, notes text, active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.project_id, c.title, c.description, c.script_or_copy,
           c.status, c.format, c.platform, c.priority, c.planned_date,
           c.published_date, c.drive_url, c.published_url, c.image_url,
           c.notes, true
    FROM public.contents c
    ORDER BY c.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mvp_create_content_v2(p_project_id uuid, p_title text, p_description text, p_script_or_copy text, p_status text, p_format text, p_platform text, p_priority text, p_planned_date date, p_published_date date, p_drive_url text, p_published_url text, p_image_url text, p_notes text)
 RETURNS public.contents
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_content public.contents;
BEGIN
    INSERT INTO public.contents (
        project_id, title, description, script_or_copy, status, format,
        platform, priority, planned_date, published_date, drive_url,
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
$function$;

-- References
CREATE OR REPLACE FUNCTION public.mvp_list_references()
 RETURNS TABLE(id uuid, project_id uuid, content_id uuid, title text, description text, type text, url text, image_url text, notes text, active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT r.id, r.project_id, r.content_id, r.title, r.description, r.type, r.url, r.image_url, r.notes, true
    FROM public."references" r
    ORDER BY r.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mvp_create_reference(p_project_id uuid, p_content_id uuid, p_title text, p_description text, p_type text, p_url text, p_image_url text, p_notes text)
 RETURNS public."references"
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_ref public."references";
BEGIN
    INSERT INTO public."references" (project_id, content_id, title, description, type, url, image_url, notes, user_id)
    VALUES (p_project_id, p_content_id, p_title, p_description, p_type, p_url, p_image_url, p_notes, auth.uid())
    RETURNING * INTO new_ref;
    RETURN new_ref;
END;
$function$;

-- Creatives
CREATE OR REPLACE FUNCTION public.mvp_list_creatives()
 RETURNS TABLE(id uuid, project_id uuid, content_id uuid, title text, type text, status text, file_url text, image_url text, description text, notes text, active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.project_id, c.content_id, c.title, c.type, c.status, c.file_url, c.image_url, c.description, c.notes, true
    FROM public.creatives c
    ORDER BY c.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mvp_create_creative(p_project_id uuid, p_content_id uuid, p_title text, p_type text, p_status text, p_file_url text, p_image_url text, p_description text, p_notes text)
 RETURNS public.creatives
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_creative public.creatives;
BEGIN
    INSERT INTO public.creatives (project_id, content_id, title, type, status, file_url, image_url, description, notes, user_id)
    VALUES (p_project_id, p_content_id, p_title, p_type, p_status, p_file_url, p_image_url, p_description, p_notes, auth.uid())
    RETURNING * INTO new_creative;
    RETURN new_creative;
END;
$function$;

-- Goals
CREATE OR REPLACE FUNCTION public.mvp_list_goals()
 RETURNS TABLE(id uuid, project_id uuid, title text, goal_type text, target_count integer, period text, start_date date, end_date date, status text, active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY 
    SELECT g.id, g.project_id, g.title, g.goal_type, g.target_count::integer, g.period, g.start_date::date, g.end_date::date, g.status, true
    FROM public.goals g
    ORDER BY g.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mvp_create_goal(p_project_id uuid, p_title text, p_goal_type text, p_target_count integer, p_period text, p_start_date date, p_end_date date, p_status text)
 RETURNS public.goals
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_goal public.goals;
BEGIN
    INSERT INTO public.goals (project_id, title, goal_type, target_count, period, start_date, end_date, status, user_id)
    VALUES (p_project_id, p_title, p_goal_type, p_target_count, p_period, p_start_date, p_end_date, p_status, auth.uid())
    RETURNING * INTO new_goal;
    RETURN new_goal;
END;
$function$;
