export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string
          education: Json | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          location: string | null
          parsed_at: string | null
          phone: string | null
          resume_text: string | null
          resume_url: string | null
          skills: Json | null
          summary: string | null
          updated_at: string
          user_id: string | null
          work_experience: Json | null
        }
        Insert: {
          created_at?: string
          education?: Json | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          location?: string | null
          parsed_at?: string | null
          phone?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          summary?: string | null
          updated_at?: string
          user_id?: string | null
          work_experience?: Json | null
        }
        Update: {
          created_at?: string
          education?: Json | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          location?: string | null
          parsed_at?: string | null
          phone?: string | null
          resume_text?: string | null
          resume_url?: string | null
          skills?: Json | null
          summary?: string | null
          updated_at?: string
          user_id?: string | null
          work_experience?: Json | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string | null
          experience_max: number | null
          experience_min: number | null
          id: string
          location: string | null
          preferred_skills: Json | null
          required_skills: Json | null
          requirements: Json | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          location?: string | null
          preferred_skills?: Json | null
          required_skills?: Json | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          location?: string | null
          preferred_skills?: Json | null
          required_skills?: Json | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          candidate_id: string
          created_at: string
          experience_match: boolean | null
          id: string
          job_id: string
          match_score: number
          matched_skills: Json | null
          missing_skills: Json | null
          notes: string | null
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          experience_match?: boolean | null
          id?: string
          job_id: string
          match_score: number
          matched_skills?: Json | null
          missing_skills?: Json | null
          notes?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          experience_match?: boolean | null
          id?: string
          job_id?: string
          match_score?: number
          matched_skills?: Json | null
          missing_skills?: Json | null
          notes?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_status: "draft" | "active" | "paused" | "closed"
      match_status: "pending" | "approved" | "rejected"
      skill_level: "beginner" | "intermediate" | "advanced" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_status: ["draft", "active", "paused", "closed"],
      match_status: ["pending", "approved", "rejected"],
      skill_level: ["beginner", "intermediate", "advanced", "expert"],
    },
  },
} as const
