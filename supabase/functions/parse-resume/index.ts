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
    const { resumeText, resumeUrl, fileName } = await req.json();
    
    if (!resumeText) {
      throw new Error("Resume text is required");
    }

    console.log("Parsing resume:", fileName);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use AI to parse the resume
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
            content: `You are an expert resume parser. Extract structured information from resumes.
            Return ONLY valid JSON with this exact structure:
            {
              "full_name": "string",
              "email": "string",
              "phone": "string or null",
              "location": "string or null",
              "summary": "brief professional summary string",
              "experience_years": number,
              "education": [{"degree": "string", "institution": "string", "year": "string or null"}],
              "work_experience": [{"title": "string", "company": "string", "duration": "string", "description": "string"}],
              "skills": [{"name": "string", "level": "beginner|intermediate|advanced|expert"}]
            }`,
          },
          {
            role: "user",
            content: `Parse this resume and extract all relevant information:\n\n${resumeText}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_resume_data",
              description: "Extract structured data from a resume",
              parameters: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  location: { type: "string" },
                  summary: { type: "string" },
                  experience_years: { type: "number" },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        degree: { type: "string" },
                        institution: { type: "string" },
                        year: { type: "string" },
                      },
                    },
                  },
                  work_experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        company: { type: "string" },
                        duration: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        level: { type: "string", enum: ["beginner", "intermediate", "advanced", "expert"] },
                      },
                    },
                  },
                },
                required: ["full_name", "email", "skills"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_resume_data" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to parse resume with AI");
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Extract the parsed data from tool call
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const parsedData = JSON.parse(toolCall.function.arguments);
    console.log("Parsed resume data:", parsedData.full_name);

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: candidate, error: insertError } = await supabase
      .from("candidates")
      .insert({
        full_name: parsedData.full_name,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        summary: parsedData.summary,
        experience_years: parsedData.experience_years || 0,
        education: parsedData.education || [],
        work_experience: parsedData.work_experience || [],
        skills: parsedData.skills || [],
        resume_url: resumeUrl,
        resume_text: resumeText,
        parsed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error("Failed to save candidate");
    }

    console.log("Candidate saved:", candidate.id);

    return new Response(JSON.stringify({ candidate, parsedData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Parse resume error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
