import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Raw GitHub URL for the public-apis README
const PUBLIC_APIS_URL = "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md";

interface ParsedAPI {
  name: string;
  description: string;
  auth: string;
  https: boolean;
  cors: string;
  link: string;
  category: string;
}

function parseMarkdownTable(markdown: string): ParsedAPI[] {
  const apis: ParsedAPI[] = [];
  const lines = markdown.split('\n');
  
  let currentCategory = '';
  let inTable = false;
  let headerPassed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect category headers (### CategoryName or ## CategoryName)
    if (line.startsWith('### ') || (line.startsWith('## ') && !line.includes('APILayer'))) {
      currentCategory = line.replace(/^#+ /, '').trim();
      // Skip non-category headers
      if (currentCategory.toLowerCase().includes('index') || 
          currentCategory.toLowerCase().includes('back to') ||
          currentCategory.toLowerCase().includes('apilayer')) {
        currentCategory = '';
        continue;
      }
      inTable = false;
      headerPassed = false;
      continue;
    }
    
    // Skip table header row
    if (line.includes('API') && line.includes('Description') && line.includes('Auth')) {
      inTable = true;
      headerPassed = false;
      continue;
    }
    
    // Skip separator row
    if (line.includes('|---') || line.includes('|:---')) {
      headerPassed = true;
      continue;
    }
    
    // Parse table data rows
    if (inTable && headerPassed && line.startsWith('|') && currentCategory) {
      // Split by pipe and clean up
      const cells = line.split('|')
        .map(c => c.trim())
        .filter((c, idx) => idx > 0 && idx < 6); // Skip first empty and limit to 5 columns
      
      if (cells.length >= 4) {
        // Extract name and link from markdown link format [name](url)
        const nameMatch = cells[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        
        if (nameMatch) {
          const authRaw = cells[2].replace(/`/g, '').toLowerCase();
          const api: ParsedAPI = {
            name: nameMatch[1].substring(0, 200),
            link: nameMatch[2],
            description: (cells[1] || 'No description available').substring(0, 500),
            auth: authRaw === 'no' || authRaw === '' ? 'none' : 
                  authRaw.includes('oauth') ? 'oauth' : 'apiKey',
            https: cells[3]?.toLowerCase() === 'yes',
            cors: cells[4]?.toLowerCase() || 'unknown',
            category: currentCategory,
          };
          apis.push(api);
        }
      }
    }
    
    // End of table on empty line or "Back to Index"
    if ((line === '' || line.includes('Back to Index')) && inTable) {
      inTable = false;
      headerPassed = false;
    }
  }
  
  return apis;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching public-apis README from GitHub...');
    
    // Fetch the markdown file
    const response = await fetch(PUBLIC_APIS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status}`);
    }
    
    const markdown = await response.text();
    console.log(`Fetched ${markdown.length} bytes of markdown`);
    
    // Parse the APIs
    const apis = parseMarkdownTable(markdown);
    console.log(`Parsed ${apis.length} APIs from markdown`);
    
    if (apis.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No APIs parsed from markdown' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Prepare records for upsert
    const records = apis.map(api => ({
      name: api.name,
      description: api.description,
      category: api.category,
      auth_type: api.auth,
      https: api.https,
      cors: api.cors,
      link: api.link,
      is_custom: false,
      is_featured: api.auth === 'none', // Feature no-auth APIs
    }));
    
    console.log(`Upserting ${records.length} API records...`);
    
    // Batch upsert in chunks of 100
    const chunkSize = 100;
    let totalInserted = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      
      const { error } = await supabase
        .from('api_catalog')
        .upsert(chunk, { 
          onConflict: 'name,link',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`Error upserting chunk ${i / chunkSize + 1}:`, error);
        totalErrors++;
      } else {
        totalInserted += chunk.length;
      }
    }
    
    console.log(`Sync complete: ${totalInserted} APIs inserted/updated, ${totalErrors} chunk errors`);
    
    // Get unique categories for stats
    const categories = [...new Set(apis.map(a => a.category))];
    
    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_parsed: apis.length,
          total_upserted: totalInserted,
          categories: categories.length,
          chunk_errors: totalErrors,
        },
        categories: categories.sort(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Sync error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
