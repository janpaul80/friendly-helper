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
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting UI Refactor with preset:", settings.preset, "intensity:", settings.intensity);

    // Build the analysis prompt based on settings
    const presetDescriptions: Record<string, string> = {
      'minimal-saas': 'Clean, minimal SaaS aesthetic with ample whitespace, clear hierarchy, and subtle accents. Think Linear, Notion, or Vercel.',
      'startup-ui': 'Modern startup look with bold typography, gradient accents, and engaging micro-interactions. Think Stripe, Loom, or Figma.',
      'enterprise': 'Professional enterprise design with structured layouts, conservative colors, and formal typography. Think Salesforce, Microsoft, or IBM.',
      'dark-dashboard': 'Dark theme dashboard with rich data visualization, glowing accents, and technical aesthetic. Think GitHub, Discord, or Raycast.',
      'conversion-focused': 'Conversion-optimized design with clear CTAs, trust signals, and compelling visual hierarchy. Think landing pages and SaaS marketing sites.',
    };

    const intensityGuide: Record<string, string> = {
      'low': 'Keep the overall structure similar, only refine details, polish spacing, and improve visual consistency.',
      'balanced': 'Reimagine the layout while preserving core functionality and user flow. Modernize components and improve hierarchy.',
      'high': 'Complete creative redesign with bold new direction while maintaining the core purpose and key features.',
    };

    const systemPrompt = `You are an expert UI/UX designer and frontend architect. Analyze the provided UI screenshot and generate professional refactoring recommendations.

Target Style: ${presetDescriptions[settings.preset] || presetDescriptions['minimal-saas']}
Refactor Intensity: ${intensityGuide[settings.intensity] || intensityGuide['balanced']}
${settings.preserveBrandColors ? 'IMPORTANT: Preserve any detected brand colors in your recommendations.' : 'Feel free to suggest completely new color schemes that match the target style.'}

You MUST respond with a valid JSON object containing exactly these fields:

{
  "designPrompt": "A detailed, reusable design prompt (250-350 words) that describes the refactored UI concept. This should be suitable for use with AI design tools or as a comprehensive design brief. Include specific details about layout, typography, colors, spacing, and interactive elements.",
  
  "implementation": {
    "layout": "Detailed layout structure description including grid system (12-col, CSS Grid areas, or Flexbox), section breakdown, spacing scale, and responsive breakpoints.",
    "tailwindTokens": "Suggested Tailwind CSS custom tokens and utilities. Include color palette (primary, secondary, accent, background, surface, text colors), spacing scale, border radius values, shadow definitions, and any custom utilities needed.",
    "componentOutline": "High-level React component hierarchy. List component names, their purpose, and nesting structure. Format as a tree structure. Do NOT include actual code, just the architecture."
  },
  
  "conceptDescriptions": [
    {
      "id": "concept-1",
      "title": "Primary Redesign",
      "description": "Main refactoring direction following the ${settings.preset} style with ${settings.intensity} intensity changes."
    },
    {
      "id": "concept-2", 
      "title": "Alternative Layout",
      "description": "Alternative approach with different layout structure while maintaining the same visual style."
    },
    {
      "id": "concept-3",
      "title": "Bold Variation",
      "description": "More experimental variation pushing creative boundaries while staying functional."
    }
  ]
}

Keep responses professional, actionable, and architecture-focused. No full code dumps. Focus on providing practical guidance for implementation.`;

    // Analyze the image with vision model
    console.log("Sending image for analysis...");
    
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
              { type: "text", text: "Analyze this UI screenshot and provide detailed refactoring recommendations in the exact JSON format specified. Focus on creating a professional, modern redesign." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("AI analysis failed:", analysisResponse.status, errorText);
      
      if (analysisResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (analysisResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Failed to analyze image: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices?.[0]?.message?.content;
    
    console.log("Analysis complete, parsing response...");

    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
      console.log("Successfully parsed analysis JSON");
    } catch (parseError) {
      console.log("Could not parse JSON response, creating structured fallback");
      analysis = {
        designPrompt: analysisContent || "Design analysis in progress. Please try again for detailed recommendations.",
        implementation: {
          layout: "Grid-based layout with responsive 12-column system. Main content area with sidebar navigation. Sections include header, hero, features, and footer.",
          tailwindTokens: `// Color Palette
--primary: 220 90% 56%;
--secondary: 210 40% 96%;
--accent: 25 95% 53%;
--background: 0 0% 100%;
--foreground: 222 47% 11%;

// Spacing Scale
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;`,
          componentOutline: `App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar (optional)
│   └── MainContent
├── Pages
│   ├── Dashboard
│   ├── Settings
│   └── Profile
└── SharedComponents
    ├── Button
    ├── Card
    ├── Modal
    └── Form`
        },
        conceptDescriptions: [
          { id: "concept-1", title: "Primary Redesign", description: "Modern clean interface with improved hierarchy" },
          { id: "concept-2", title: "Alternative Layout", description: "Different structural approach with same aesthetic" },
          { id: "concept-3", title: "Bold Variation", description: "Experimental take with stronger visual impact" }
        ]
      };
    }

    // Generate UI preview images if requested
    let concepts = [];
    
    if (settings.generatePreviews && analysis.conceptDescriptions) {
      console.log("Generating premium UI preview images for", analysis.conceptDescriptions.length, "concepts...");
      
      // Premium style descriptions for each concept variation
      const styleVariations = [
        "sleek, minimal dark theme with glass morphism, frosted glass panels, subtle depth shadows, inspired by Linear and Vercel dashboards",
        "bold modern aesthetic with gradient accents, sharp geometric shapes, premium card design, inspired by Framer and Stripe interfaces",
        "sophisticated enterprise look with refined typography, subtle color hierarchy, polished hover states, inspired by Notion and Arc browser"
      ];
      
      for (let i = 0; i < Math.min(analysis.conceptDescriptions.length, 3); i++) {
        const concept = analysis.conceptDescriptions[i];
        
        try {
          // Premium image generation prompt - Framer/Vercel quality
          const imagePrompt = `Create a stunning, ultra-premium UI screenshot mockup. This should look like a real, polished product screenshot from Vercel, Linear, or Framer.

VISUAL STYLE: ${styleVariations[i]}

CONCEPT: ${concept.title} - ${concept.description}

CRITICAL REQUIREMENTS:
• Photorealistic UI mockup - must look like an actual screenshot, NOT an illustration
• Dark background (#0a0a0f to #111118 gradient)
• Crisp, pixel-perfect elements with anti-aliased edges
• Professional typography hierarchy using Inter or SF Pro style fonts
• Subtle glassmorphism effects with backdrop blur
• Refined color palette: dark grays, orange/amber accents (#f97316), white text
• Realistic shadows and depth (soft diffused shadows, not harsh)
• Clean grid-based layout with generous whitespace
• Modern UI components: sleek cards, refined buttons, subtle borders
• Desktop 16:9 widescreen aspect ratio
• Ultra high resolution, sharp details, 4K quality

DO NOT: Create cartoon-like graphics, use bright colors, include people, use stock photo elements, create flat illustrations.

This mockup should be indistinguishable from a real Dribbble shot from a top designer.`;
          
          console.log(`Generating premium concept ${i + 1}: ${concept.title}`);
          
          // Use the PRO image model for maximum quality
          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-pro-image-preview",
              messages: [{ role: "user", content: imagePrompt }],
              modalities: ["image", "text"]
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
            
            if (generatedImage) {
              concepts.push({
                id: concept.id || `concept-${i + 1}`,
                title: concept.title || `Concept ${i + 1}`,
                imageUrl: generatedImage
              });
              console.log(`Successfully generated premium concept ${i + 1}`);
            } else {
              console.log(`No image returned for concept ${i + 1}, using placeholder`);
              concepts.push(createPlaceholderConcept(concept, i));
            }
          } else {
            const errText = await imageResponse.text();
            console.error(`Image generation failed for concept ${i + 1}:`, imageResponse.status, errText);
            concepts.push(createPlaceholderConcept(concept, i));
          }
        } catch (err) {
          console.error(`Error generating concept ${i + 1}:`, err);
          concepts.push(createPlaceholderConcept(concept, i));
        }
        
        // Delay between generations to avoid rate limiting with pro model
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
    }

    // If no images were generated or previews disabled, create placeholder concepts
    if (concepts.length === 0) {
      console.log("Creating placeholder concepts...");
      concepts = (analysis.conceptDescriptions || []).map((c: any, i: number) => 
        createPlaceholderConcept(c, i)
      );
    }

    const results = {
      concepts,
      designPrompt: analysis.designPrompt || "Design prompt generation pending...",
      implementation: {
        layout: analysis.implementation?.layout || "Layout analysis pending...",
        tailwindTokens: analysis.implementation?.tailwindTokens || "Token extraction pending...",
        componentOutline: analysis.implementation?.componentOutline || "Component structure pending..."
      }
    };

    console.log("UI Refactor complete. Returning", concepts.length, "concepts");

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("UI Refactor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Processing failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function createPlaceholderConcept(concept: any, index: number) {
  const title = concept?.title || `Concept ${index + 1}`;
  const description = concept?.description || 'UI concept variation';
  
  // Create a more detailed SVG placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0a0a0f"/>
        <stop offset="100%" style="stop-color:#1a1a24"/>
      </linearGradient>
    </defs>
    <rect fill="url(#bg${index})" width="800" height="450"/>
    <rect fill="#111118" x="20" y="20" width="760" height="410" rx="12"/>
    <rect fill="#1a1a24" x="40" y="40" width="200" height="30" rx="6"/>
    <rect fill="#0f0f14" x="40" y="90" width="720" height="320" rx="8"/>
    <rect fill="#1a1a24" x="60" y="110" width="340" height="140" rx="6"/>
    <rect fill="#1a1a24" x="420" y="110" width="320" height="140" rx="6"/>
    <rect fill="#1a1a24" x="60" y="270" width="680" height="120" rx="6"/>
    <text fill="#666" x="400" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="500">${title}</text>
    <text fill="#444" x="400" y="250" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12">${description.slice(0, 50)}${description.length > 50 ? '...' : ''}</text>
  </svg>`;
  
  return {
    id: concept?.id || `concept-${index + 1}`,
    title: title,
    imageUrl: `data:image/svg+xml,${encodeURIComponent(svg)}`
  };
}
