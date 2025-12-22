import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Candidate {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  experience_years: number;
  education: any[];
  work_experience: any[];
  skills: any[];
  resume_url: string | null;
  resume_text: string | null;
  parsed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Candidate[];
    },
  });
}

export function useCandidate(id: string | null) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Candidate;
    },
    enabled: !!id,
  });
}

export function useParseResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeText, resumeUrl, fileName }: { resumeText: string; resumeUrl?: string; fileName: string }) => {
      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: { resumeText, resumeUrl, fileName },
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}
