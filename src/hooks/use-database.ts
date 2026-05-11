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

export type DashboardSummary = {
  active_projects: number;
  today_planned_contents: number;
  ready_contents: number;
  late_contents: number;
  published_contents: number;
  active_goals: number;
  recent_references: any[];
  upcoming_contents: any[];
};

// Dashboard Hook
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_dashboard_summary");
      if (error) throw error;
      return data as DashboardSummary;
    },
  });
}

// Projects Hooks
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_projects");
      if (error) throw error;
      
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        objective: p.objective,
        niche: p.niche,
        main_platform: p.main_platform,
        status: p.status,
        daily_content_goal: p.daily_content_goal,
        drive_url: p.drive_url,
        start_date: p.start_date,
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

// Contents Hooks
export function useContents() {
  return useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_contents");
      if (error) throw error;
      
      return (data || []).map((c: any) => ({
        id: c.id,
        project_id: c.project_id,
        title: c.title,
        description: c.description,
        script_or_copy: c.script_or_copy,
        status: c.status,
        format: c.format,
        platform: c.platform,
        priority: c.priority,
        planned_date: c.planned_date,
        published_date: c.published_date,
        drive_url: c.drive_url,
        published_url: c.published_url,
        image_url: c.image_url,
        notes: c.notes,
        active: c.active !== undefined ? c.active : true,
      })) as Content[];
    },
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const { data, error } = await (supabase as any).rpc("mvp_create_content_v2", {
        p_project_id: content.project_id,
        p_title: content.title,
        p_description: content.description,
        p_script_or_copy: content.script_or_copy,
        p_status: content.status || 'idea',
        p_format: content.format,
        p_platform: content.platform,
        p_priority: content.priority || 'medium',
        p_planned_date: content.planned_date || null,
        p_published_date: content.published_date || null,
        p_drive_url: content.drive_url,
        p_published_url: content.published_url,
        p_image_url: content.image_url,
        p_notes: content.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Content> & { id: string }) => {
      const { data, error } = await (supabase as any).rpc("mvp_update_content", {
        p_id: id,
        p_project_id: updates.project_id,
        p_title: updates.title,
        p_description: updates.description,
        p_script_or_copy: updates.script_or_copy,
        p_status: updates.status,
        p_format: updates.format,
        p_platform: updates.platform,
        p_priority: updates.priority,
        p_planned_date: updates.planned_date,
        p_published_date: updates.published_date,
        p_drive_url: updates.drive_url,
        p_published_url: updates.published_url,
        p_image_url: updates.image_url,
        p_notes: updates.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useArchiveContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (supabase as any).rpc("mvp_archive_content", {
        p_id: id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

// References Hooks
export function useReferences() {
  return useQuery({
    queryKey: ["references"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_references");
      if (error) throw error;
      
      return (data || []).map((r: any) => ({
        id: r.id,
        project_id: r.project_id,
        content_id: r.content_id,
        title: r.title,
        description: r.description,
        type: r.type,
        url: r.url,
        image_url: r.image_url,
        notes: r.notes,
        active: r.active !== undefined ? r.active : true,
      })) as Reference[];
    },
  });
}

export function useCreateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reference: Partial<Reference>) => {
      const { data, error } = await (supabase as any).rpc("mvp_create_reference", {
        p_project_id: reference.project_id || null,
        p_content_id: reference.content_id || null,
        p_title: reference.title,
        p_description: reference.description,
        p_type: reference.type,
        p_url: reference.url,
        p_image_url: reference.image_url,
        p_notes: reference.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useUpdateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reference> & { id: string }) => {
      const { data, error } = await (supabase as any).rpc("mvp_update_reference", {
        p_id: id,
        p_project_id: updates.project_id,
        p_content_id: updates.content_id,
        p_title: updates.title,
        p_description: updates.description,
        p_type: updates.type,
        p_url: updates.url,
        p_image_url: updates.image_url,
        p_notes: updates.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useArchiveReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (supabase as any).rpc("mvp_archive_reference", {
        p_id: id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

// Creatives Hooks
export function useCreatives() {
  return useQuery({
    queryKey: ["creatives"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_creatives");
      if (error) throw error;
      
      return (data || []).map((c: any) => ({
        id: c.id,
        project_id: c.project_id,
        content_id: c.content_id,
        title: c.title,
        type: c.type,
        status: c.status,
        file_url: c.file_url,
        image_url: c.image_url,
        description: c.description,
        notes: c.notes,
        active: c.active !== undefined ? c.active : true,
      })) as Creative[];
    },
  });
}

export function useCreateCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creative: Partial<Creative>) => {
      const { data, error } = await (supabase as any).rpc("mvp_create_creative", {
        p_project_id: creative.project_id,
        p_content_id: creative.content_id,
        p_title: creative.title,
        p_type: creative.type,
        p_status: creative.status || 'draft',
        p_file_url: creative.file_url,
        p_image_url: creative.image_url,
        p_description: creative.description,
        p_notes: creative.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatives"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useUpdateCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Creative> & { id: string }) => {
      const { data, error } = await (supabase as any).rpc("mvp_update_creative", {
        p_id: id,
        p_project_id: updates.project_id,
        p_content_id: updates.content_id,
        p_title: updates.title,
        p_type: updates.type,
        p_status: updates.status,
        p_file_url: updates.file_url,
        p_image_url: updates.image_url,
        p_description: updates.description,
        p_notes: updates.notes
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatives"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useArchiveCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (supabase as any).rpc("mvp_archive_creative", {
        p_id: id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatives"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

// Goals Hooks
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("mvp_list_goals");
      if (error) throw error;
      
      return (data || []).map((g: any) => ({
        id: g.id,
        project_id: g.project_id,
        title: g.title,
        goal_type: g.goal_type,
        target_count: g.target_count,
        period: g.period,
        start_date: g.start_date,
        end_date: g.end_date,
        status: g.status,
        active: g.active !== undefined ? g.active : true,
      })) as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal>) => {
      const { data, error } = await (supabase as any).rpc("mvp_create_goal", {
        p_project_id: goal.project_id,
        p_title: goal.title,
        p_goal_type: goal.goal_type,
        p_target_count: goal.target_count,
        p_period: goal.period,
        p_start_date: goal.start_date,
        p_end_date: goal.end_date,
        p_status: goal.status || 'active'
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await (supabase as any).rpc("mvp_update_goal", {
        p_id: id,
        p_project_id: updates.project_id,
        p_title: updates.title,
        p_goal_type: updates.goal_type,
        p_target_count: updates.target_count,
        p_period: updates.period,
        p_start_date: updates.start_date,
        p_end_date: updates.end_date,
        p_status: updates.status
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useArchiveGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await (supabase as any).rpc("mvp_archive_goal", {
        p_id: id
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
