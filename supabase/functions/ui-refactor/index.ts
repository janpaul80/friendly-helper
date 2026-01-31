// @ts-nocheck
// Edge function for UI Refactor - runs in Deno runtime

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RefactorSettings {
  preset: string;
  intensity: string;
  preserveBrandColors: boolean;
  generatePreviews: boolean;
  generatePromptAndCode: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, settings } = await req.json() as { image: string; settings: RefactorSettings };
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the analysis prompt based on settings
    const presetDescriptions: Record<string, string> = {
      'minimal-saas': 'Clean, minimal SaaS aesthetic with ample whitespace, clear hierarchy, and subtle accents',
      'startup-ui': 'Modern startup look with bold typography, gradient accents, and engaging micro-interactions',
      'enterprise': 'Professional enterprise design with structured layouts, conservative colors, and formal typography',
      'dark-dashboard': 'Dark theme dashboard with rich data visualization, glowing accents, and technical aesthetic',
      'conversion-focused': 'Conversion-optimized design with clear CTAs, trust signals, and compelling visual hierarchy',
    };

    const intensityGuide: Record<string, string> = {
      'low': 'Keep the overall structure similar, only refine details and polish',
      'balanced': 'Reimagine the layout while preserving core functionality and user flow',
      'high': 'Complete redesign with bold creative direction while maintaining purpose',
    };

    const systemPrompt = `You are an expert UI/UX designer and frontend architect. Analyze the provided UI screenshot and generate refactoring recommendations.

Preset Style: ${presetDescriptions[settings.preset] || presetDescriptions['minimal-saas']}
Intensity: ${intensityGuide[settings.intensity] || intensityGuide['balanced']}
${settings.preserveBrandColors ? 'Preserve detected brand colors in recommendations.' : 'Feel free to suggest new color schemes.'}

Respond with a JSON object containing:
1. "designPrompt": A detailed design prompt (200-300 words) describing the refactored UI concept, suitable for use with AI design tools or as a design brief.

2. "implementation": An object with:
   - "layout": A text description of the layout structure (grid system, sections, spacing)
   - "tailwindTokens": Suggested Tailwind CSS custom tokens and utilities
   - "componentOutline": High-level React component structure (component names and hierarchy, not full code)

3. "conceptDescriptions": An array of 2-3 objects, each with:
   - "id": unique string
   - "title": short descriptive title
   - "description": brief description of this concept variation

Keep responses professional, actionable, and architecture-focused. No full code dumps.`;

    console.log("Starting UI analysis with preset:", settings.preset);

    // First, analyze the image
    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this UI screenshot and provide refactoring recommendations in JSON format:" },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!analysisResponse.ok) {
      console.error("AI analysis failed:", analysisResponse.status);
      if (analysisResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (analysisResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to analyze image");
    }

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices?.[0]?.message?.content;
    
    console.log("Analysis complete, parsing response");

    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch {
      console.log("Could not parse JSON, using raw content");
      analysis = {
        designPrompt: analysisContent,
        implementation: {
          layout: "Unable to parse structured layout",
          tailwindTokens: "Unable to parse tokens",
          componentOutline: "Unable to parse component structure"
        },
        conceptDescriptions: [
          { id: "concept-1", title: "Primary Concept", description: "Main refactoring direction" }
        ]
      };
    }

    // Generate UI previews if requested
    let concepts = [];
    if (settings.generatePreviews && analysis.conceptDescriptions) {
      console.log("Generating UI preview images");
      for (let i = 0; i < Math.min(analysis.conceptDescriptions.length, 3); i++) {
        const concept = analysis.conceptDescriptions[i];
        try {
          const imagePrompt = `UI mockup in ${settings.preset} style: ${concept.description}. ${analysis.designPrompt?.slice(0, 200)}. Dark theme, professional, high-fidelity mockup. Ultra high resolution.`;
          
          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [{ role: "user", content: imagePrompt }],
              modalities: ["image", "text"]
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
            if (generatedImage) {
              concepts.push({
                id: concept.id,
                title: concept.title,
                imageUrl: generatedImage
              });
              console.log(`Generated concept ${i + 1}`);
            }
          }
        } catch (err) {
          console.error(`Failed to generate concept ${i}:`, err);
        }
      }
    }

    // If no images were generated, create placeholder concepts
    if (concepts.length === 0) {
      concepts = (analysis.conceptDescriptions || []).map((c: { id?: string; title?: string }, i: number) => ({
        id: c.id || `concept-${i + 1}`,
        title: c.title || `Concept ${i + 1}`,
        imageUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#0a0a0f" width="400" height="200"/><rect fill="#1a1a24" x="20" y="20" width="360" height="160" rx="8"/><text fill="#666" x="200" y="105" text-anchor="middle" font-family="monospace" font-size="14">${c.title || 'Concept ' + (i + 1)}</text></svg>`)}`
      }));
    }

    const results = {
      concepts,
      designPrompt: analysis.designPrompt || "Design prompt generation in progress...",
      implementation: {
        layout: analysis.implementation?.layout || "Layout analysis pending...",
        tailwindTokens: analysis.implementation?.tailwindTokens || "Token extraction pending...",
        componentOutline: analysis.implementation?.componentOutline || "Component structure pending..."
      }
    };

    console.log("UI Refactor complete, returning results");

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("UI Refactor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
