import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, candidateId } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get job(s) to match
    let jobsQuery = supabase.from("jobs").select("*").eq("status", "active");
    if (jobId) {
      jobsQuery = supabase.from("jobs").select("*").eq("id", jobId);
    }
    const { data: jobs, error: jobsError } = await jobsQuery;
    
    if (jobsError) throw new Error("Failed to fetch jobs");
    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ matches: [], message: "No jobs found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get candidate(s) to match
    let candidatesQuery = supabase.from("candidates").select("*");
    if (candidateId) {
      candidatesQuery = candidatesQuery.eq("id", candidateId);
    }
    const { data: candidates, error: candidatesError } = await candidatesQuery;
    
    if (candidatesError) throw new Error("Failed to fetch candidates");
    if (!candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ matches: [], message: "No candidates found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Matching ${candidates.length} candidates with ${jobs.length} jobs`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const newMatches = [];

    for (const job of jobs) {
      for (const candidate of candidates) {
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from("matches")
          .select("id")
          .eq("candidate_id", candidate.id)
          .eq("job_id", job.id)
          .single();

        if (existingMatch) {
          console.log(`Match already exists for candidate ${candidate.id} and job ${job.id}`);
          continue;
        }

        const candidateSkills = (candidate.skills || []).map((s: any) => 
          typeof s === 'string' ? s : s.name
        );
        const jobRequiredSkills = (job.required_skills || []).map((s: any) => 
          typeof s === 'string' ? s : s.name || s
        );
        const jobPreferredSkills = (job.preferred_skills || []).map((s: any) => 
          typeof s === 'string' ? s : s.name || s
        );

        // Use AI for intelligent matching
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are an expert recruiter AI that matches candidates to jobs. Analyze the candidate and job, then return a match score (0-100) with detailed analysis.`,
              },
              {
                role: "user",
                content: `Match this candidate to this job:

CANDIDATE:
Name: ${candidate.full_name}
Experience: ${candidate.experience_years} years
Skills: ${candidateSkills.join(", ")}
Summary: ${candidate.summary || "N/A"}

JOB:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${jobRequiredSkills.join(", ")}
Preferred Skills: ${jobPreferredSkills.join(", ")}
Experience Required: ${job.experience_min}-${job.experience_max || "any"} years
Description: ${job.description || "N/A"}`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "calculate_match",
                  description: "Calculate match score between candidate and job",
                  parameters: {
                    type: "object",
                    properties: {
                      match_score: { type: "number", minimum: 0, maximum: 100 },
                      matched_skills: { type: "array", items: { type: "string" } },
                      missing_skills: { type: "array", items: { type: "string" } },
                      experience_match: { type: "boolean" },
                      notes: { type: "string" },
                    },
                    required: ["match_score", "matched_skills", "missing_skills", "experience_match"],
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "calculate_match" } },
          }),
        });

        if (!response.ok) {
          console.error("AI matching error for", candidate.id, job.id);
          continue;
        }

        const aiResponse = await response.json();
        const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
        
        if (!toolCall?.function?.arguments) {
          console.error("Invalid AI response for match");
          continue;
        }

        const matchData = JSON.parse(toolCall.function.arguments);
        console.log(`Match: ${candidate.full_name} -> ${job.title}: ${matchData.match_score}%`);

        // Save match to database
        const { data: match, error: matchError } = await supabase
          .from("matches")
          .insert({
            candidate_id: candidate.id,
            job_id: job.id,
            match_score: matchData.match_score,
            matched_skills: matchData.matched_skills,
            missing_skills: matchData.missing_skills,
            experience_match: matchData.experience_match,
            notes: matchData.notes,
            status: "pending",
          })
          .select()
          .single();

        if (matchError) {
          console.error("Failed to save match:", matchError);
          continue;
        }

        newMatches.push(match);
      }
    }

    console.log(`Created ${newMatches.length} new matches`);

    return new Response(JSON.stringify({ matches: newMatches, count: newMatches.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Match candidates error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
