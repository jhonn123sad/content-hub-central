import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  objective: string | null;
  niche: string | null;
  main_platform: string | null;
  status: string;
  daily_content_goal: number | null;
  drive_url: string | null;
  start_date: string | null;
  active: boolean;
};

export type Content = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  script_or_copy: string | null;
  status: string;
  format: string | null;
  platform: string | null;
  priority: string | null;
  planned_date: string | null;
  published_date: string | null;
  drive_url: string | null;
  published_url: string | null;
  image_url: string | null;
  storage_path: string | null;
  notes: string | null;
  active: boolean;
};

export type Reference = {
  id: string;
  project_id: string | null;
  content_id: string | null;
  title: string;
  description: string | null;
  type: string | null;
  url: string | null;
  image_url: string | null;
  storage_path: string | null;
  notes: string | null;
  active: boolean;
};

export type Creative = {
  id: string;
  project_id: string | null;
  content_id: string | null;
  title: string;
  type: string | null;
  status: string | null;
  file_url: string | null;
  image_url: string | null;
  storage_path: string | null;
  description: string | null;
  notes: string | null;
  active: boolean;
};

export type Goal = {
  id: string;
  project_id: string | null;
  title: string;
  goal_type: string | null;
  target_count: number | null;
  period: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  active: boolean;
};

// Projects Hooks
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_projects");
      if (error) throw error;
      
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title || p.titulo,
        description: p.description || p.descricao,
        status: p.status,
        active: p.active !== undefined ? p.active : true,
      })) as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await (supabase as any).rpc("mvp_create_project", {
        p_title: project.title,
        p_description: project.description,
        p_status: project.status || 'active'
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await (supabase as any).rpc("mvp_update_project", {
        p_id: id,
        p_title: updates.title,
        p_description: updates.description,
        p_status: updates.status
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (supabase as any).rpc("mvp_archive_project", {
        p_id: id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// Contents Hooks
export function useContents() {
  return useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("conteudos")
        .select("id, titulo, formato, status, url_midia, data_publicacao, projeto_id, created_at, updated_at");
      if (error) throw error;
      
      return (data || []).map((c: any) => ({
        id: c.id,
        title: c.titulo,
        format: c.formato,
        status: c.status,
        drive_url: c.url_midia,
        published_url: c.url_midia,
        published_date: c.data_publicacao,
        project_id: c.projeto_id,
        active: true,
      })) as Content[];
    },
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const { data, error } = await (supabase as any)
        .from("conteudos")
        .insert([{
          titulo: content.title,
          formato: content.format,
          status: content.status || 'idea',
          url_midia: content.drive_url || content.published_url,
          data_publicacao: content.published_date,
          projeto_id: content.project_id,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Content> & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from("conteudos")
        .update({
          titulo: updates.title,
          formato: updates.format,
          status: updates.status,
          url_midia: updates.drive_url || updates.published_url,
          data_publicacao: updates.published_date,
          projeto_id: updates.project_id,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

// References Hooks
export function useReferences() {
  return useQuery({
    queryKey: ["references"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("referencias")
        .select("id, titulo, url, created_at, updated_at");
      if (error) throw error;
      
      return (data || []).map((r: any) => ({
        id: r.id,
        title: r.titulo,
        url: r.url,
        active: true,
      })) as Reference[];
    },
  });
}

export function useCreateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reference: Partial<Reference>) => {
      const { data, error } = await (supabase as any)
        .from("referencias")
        .insert([{
          titulo: reference.title,
          url: reference.url,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
    },
  });
}

// Creatives Hooks
export function useCreatives() {
  return useQuery({
    queryKey: ["creatives"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("criativos")
        .select("id, nome, tipo_arquivo, url_arquivo, conteudo_id, created_at, updated_at");
      if (error) throw error;
      
      return (data || []).map((c: any) => ({
        id: c.id,
        title: c.nome,
        type: c.tipo_arquivo,
        file_url: c.url_arquivo,
        content_id: c.conteudo_id,
        active: true,
      })) as Creative[];
    },
  });
}

export function useCreateCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creative: Partial<Creative>) => {
      const { data, error } = await (supabase as any)
        .from("criativos")
        .insert([{
          nome: creative.title,
          tipo_arquivo: creative.type,
          url_arquivo: creative.file_url,
          conteudo_id: creative.content_id,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatives"] });
    },
  });
}

// Goals Hooks
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("metas")
        .select("id, titulo, objetivo_valor, prazo, created_at, updated_at");
      if (error) throw error;
      
      return (data || []).map((g: any) => ({
        id: g.id,
        title: g.titulo,
        target_count: g.objetivo_valor,
        end_date: g.prazo,
        active: true,
      })) as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal>) => {
      const { data, error } = await (supabase as any)
        .from("metas")
        .insert([{
          titulo: goal.title,
          objetivo_valor: goal.target_count,
          prazo: goal.end_date,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
