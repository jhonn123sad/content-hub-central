import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  objective?: string | null;
  niche?: string | null;
  main_platform?: string | null;
  daily_content_goal?: number | null;
  start_date?: string | null;
  created_at?: string;
};

export type Content = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  format: string | null;
  platform: string | null;
  priority?: string | null;
  planned_date: string | null;
  published_date: string | null;
  script_or_copy?: string | null;
  drive_url?: string | null;
  published_url?: string | null;
  image_url?: string | null;
  notes?: string | null;
  sort_order?: number;
  created_at?: string;
};

export type Reference = {
  id: string;
  project_id: string | null;
  content_id?: string | null;
  title: string;
  description: string | null;
  type: string | null;
  url: string | null;
  image_url?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type Creative = {
  id: string;
  project_id: string | null;
  content_id?: string | null;
  title: string;
  type: string | null;
  status: string | null;
  file_url: string;
  image_url?: string | null;
  description?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type Goal = {
  id: string;
  project_id: string | null;
  title: string;
  goal_type: string | null;
  target_count: number | null;
  current_count: number | null;
  period?: string | null;
  start_date?: string | null;
  end_date: string | null;
  status: string;
  created_at?: string;
};

// Dashboard Hook
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const [projectsCount, contentsCount, goalsCount, recentRefs, upcomingContents] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("contents").select("id", { count: "exact", head: true }),
        supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("references").select("*").order("created_at", { ascending: false }).limit(4),
        supabase.from("contents").select("*").gte("planned_date", new Date().toISOString().split('T')[0]).order("planned_date", { ascending: true }).limit(5)
      ]);

      return {
        active_projects: projectsCount.count || 0,
        total_contents: contentsCount.count || 0,
        active_goals: goalsCount.count || 0,
        today_planned_contents: 0, // Placeholder
        ready_contents: 0, // Placeholder
        late_contents: 0, // Placeholder
        published_contents: 0, // Placeholder
        recent_references: (recentRefs.data || []) as any[],
        upcoming_contents: (upcomingContents.data || []) as any[]
      };
    },
  });
}

// Projects Hooks
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await supabase.from("projects").insert([project as any]).select().single();
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
      const { data, error } = await supabase.from("projects").update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
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
      const { data, error } = await supabase.from("contents").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Content[];
    },
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const { data, error } = await supabase.from("contents").insert([content as any]).select().single();
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
      const { data, error } = await supabase.from("contents").update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contents").delete().eq("id", id);
      if (error) throw error;
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
      const { data, error } = await supabase.from("references").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Reference[];
    },
  });
}

export function useCreateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reference: Partial<Reference>) => {
      const { data, error } = await supabase.from("references").insert([reference as any]).select().single();
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
      const { data, error } = await supabase.from("references").update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["references"] });
    },
  });
}

export function useDeleteReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("references").delete().eq("id", id);
      if (error) throw error;
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
      const { data, error } = await supabase.from("creatives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Creative[];
    },
  });
}

export function useCreateCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creative: Partial<Creative>) => {
      const { data, error } = await supabase.from("creatives").insert([creative as any]).select().single();
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
      const { data, error } = await supabase.from("creatives").update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creatives"] });
    },
  });
}

export function useDeleteCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("creatives").delete().eq("id", id);
      if (error) throw error;
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
      const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal>) => {
      const { data, error } = await supabase.from("goals").insert([goal as any]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
