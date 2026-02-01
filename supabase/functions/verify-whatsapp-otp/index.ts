import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanPhone = phone.replace(/\s/g, '');
    const cleanCode = code.trim();

    // Initialize Supabase with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', cleanPhone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching OTP:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Verification failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpRecord) {
      return new Response(
        JSON.stringify({ error: 'No verification code found. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Delete expired code
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
      return new Response(
        JSON.stringify({ error: 'Verification code expired. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check attempts (max 5)
    if (otpRecord.attempts >= 5) {
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the code
    if (otpRecord.code !== cleanCode) {
      // Increment attempts
      await supabase
        .from('otp_codes')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Code is valid! Mark as verified
    await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    // Create or sign in the user using Supabase Admin API
    // First, check if user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.phone === cleanPhone);

    let session;
    let user;

    if (existingUser) {
      // User exists - create a session for them
      console.log('Existing user found, creating session');
      
      // Generate a magic link token for the user
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: existingUser.email || `${cleanPhone.replace('+', '')}@phone.local`,
      });

      if (linkError) {
        console.error('Error generating magic link:', linkError);
        // Fallback: Update phone and create session directly
        const { data: sessionData, error: sessionError } = await supabase.auth.admin.createUser({
          phone: cleanPhone,
          phone_confirm: true,
          user_metadata: { phone_verified: true }
        });
        
        if (sessionError && !sessionError.message.includes('already been registered')) {
          throw sessionError;
        }
      }

      // Get user session using signInWithPassword won't work, so we'll return user info
      user = existingUser;
    } else {
      // Create new user
      console.log('Creating new user for phone:', cleanPhone);
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        phone: cleanPhone,
        phone_confirm: true,
        user_metadata: { 
          phone_verified: true,
          auth_method: 'whatsapp_otp'
        }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      user = newUser.user;
    }

    // Generate a session token for the user
    // Since we can't create a session directly with admin API, we'll use a workaround
    // by signing in with a temporary password
    
    // First, set a temporary password for the user
    const tempPassword = crypto.randomUUID();
    
    await supabase.auth.admin.updateUserById(user.id, {
      password: tempPassword,
      email: user.email || `${cleanPhone.replace(/\+/g, '')}@whatsapp.heftcoder.com`,
      email_confirm: true,
    });

    // Now sign in with that password to get a session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email || `${cleanPhone.replace(/\+/g, '')}@whatsapp.heftcoder.com`,
      password: tempPassword,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      // Still return success since user is verified
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          user: { id: user.id, phone: cleanPhone },
          message: 'Verified but please try signing in again'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean up the OTP record
    await supabase.from('otp_codes').delete().eq('id', otpRecord.id);

    console.log('User verified and signed in:', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        session: signInData.session,
        user: signInData.user
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-whatsapp-otp:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
