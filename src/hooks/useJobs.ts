import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Job {
  id: string;
  user_id: string | null;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  requirements: any[];
  required_skills: any[];
  preferred_skills: any[];
  experience_min: number;
  experience_max: number | null;
  salary_min: number | null;
  salary_max: number | null;
  status: "draft" | "active" | "paused" | "closed";
  created_at: string;
  updated_at: string;
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useJob(id: string | null) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: { title: string; company: string } & Partial<Omit<Job, "title" | "company">>) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          required_skills: job.required_skills,
          preferred_skills: job.preferred_skills,
          experience_min: job.experience_min,
          experience_max: job.experience_max,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          status: job.status,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Job> & { id: string }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
