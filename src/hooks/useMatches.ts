import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  candidate_id: string;
  job_id: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  experience_match: boolean;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  created_at: string;
  updated_at: string;
  candidate?: {
    id: string;
    full_name: string;
    email: string;
    skills: any[];
  };
  job?: {
    id: string;
    title: string;
    company: string;
    required_skills: any[];
  };
}

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          candidate:candidates(id, full_name, email, skills),
          job:jobs(id, title, company, required_skills)
        `)
        .order("match_score", { ascending: false });
      
      if (error) throw error;
      return data as Match[];
    },
  });
}

export function useRunMatching() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, candidateId }: { jobId?: string; candidateId?: string } = {}) => {
      const { data, error } = await supabase.functions.invoke("match-candidates", {
        body: { jobId, candidateId },
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) => {
      const { data, error } = await supabase
        .from("matches")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
