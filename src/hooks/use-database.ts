import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
};

export type Content = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  format: string | null;
  platform: string | null;
  planned_date: string | null;
  published_date: string | null;
  created_at: string;
};

export type Reference = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  type: string | null;
  url: string | null;
  created_at: string;
};

export type Creative = {
  id: string;
  project_id: string | null;
  title: string;
  type: string | null;
  status: string | null;
  file_url: string | null;
  created_at: string;
};

export type Goal = {
  id: string;
  project_id: string | null;
  title: string;
  goal_type: string | null;
  target_count: number | null;
  current_count: number | null;
  end_date: string | null;
  status: string;
};

// Dashboard Hook
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      // Simplificado: buscando contagens diretas das tabelas
      const [projects, contents, goals] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("contents").select("id", { count: "exact", head: true }),
        supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "active")
      ]);

      return {
        active_projects: projects.count || 0,
        total_contents: contents.count || 0,
        active_goals: goals.count || 0,
        published_contents: 0, // Placeholder
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
      const { data, error } = await supabase.from("projects").insert([project]).select().single();
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
      const { data, error } = await supabase.from("contents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Content[];
    },
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const { data, error } = await supabase.from("contents").insert([content]).select().single();
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
      const { data, error } = await supabase.from("references").insert([reference]).select().single();
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
      const { data, error } = await supabase.from("creatives").insert([creative]).select().single();
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
      const { data, error } = await supabase.from("goals").insert([goal]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
