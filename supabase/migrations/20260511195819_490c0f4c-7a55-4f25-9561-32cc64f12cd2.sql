-- Make user_id nullable in all tables
ALTER TABLE public.projects ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.contents ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public."references" ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.creatives ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.goals ALTER COLUMN user_id DROP NOT NULL;

-- Simplify RLS: Enable public access for now (MVP)
-- We use "USING (true)" to allow all operations for testing without auth friction

DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Public full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own content" ON public.contents;
CREATE POLICY "Public full access contents" ON public.contents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own references" ON public."references";
CREATE POLICY "Public full access references" ON public."references" FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own creatives" ON public.creatives;
CREATE POLICY "Public full access creatives" ON public.creatives FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own goals" ON public.goals;
CREATE POLICY "Public full access goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- Ensure projects have active default
ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE public.contents ALTER COLUMN status SET DEFAULT 'idea';
ALTER TABLE public.creatives ALTER COLUMN status SET DEFAULT 'draft';
ALTER TABLE public.goals ALTER COLUMN status SET DEFAULT 'active';
