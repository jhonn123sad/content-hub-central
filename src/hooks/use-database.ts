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
      const { data, error } = await (supabase as any)
        .from("projects")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await (supabase as any)
        .from("projects")
        .insert([project])
        .select()
        .single();
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
      const { data, error } = await (supabase as any)
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
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
        .from("contents")
        .select("*")
        .eq("active", true)
        .order("planned_date", { ascending: true });
      if (error) throw error;
      return data as Content[];
    },
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: Partial<Content>) => {
      const { data, error } = await (supabase as any)
        .from("contents")
        .insert([content])
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
        .from("contents")
        .update(updates)
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
        .from("references")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Reference[];
    },
  });
}

export function useCreateReference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reference: Partial<Reference>) => {
      const { data, error } = await (supabase as any)
        .from("references")
        .insert([reference])
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
        .from("creatives")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Creative[];
    },
  });
}

export function useCreateCreative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creative: Partial<Creative>) => {
      const { data, error } = await (supabase as any)
        .from("creatives")
        .insert([creative])
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
        .from("goals")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal>) => {
      const { data, error } = await (supabase as any)
        .from("goals")
        .insert([goal])
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
