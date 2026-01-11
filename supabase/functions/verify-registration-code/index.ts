import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registrationCode } = await req.json();

    if (!registrationCode || typeof registrationCode !== "string") {
      return new Response(
        JSON.stringify({ valid: false, error: "Registration code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const code = registrationCode.toUpperCase().trim();
    
    if (code.length !== 6) {
      return new Response(
        JSON.stringify({ valid: false, error: "Registration code must be 6 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Verifying registration code:", code);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if the code exists in payments and is completed
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("email, registration_code, status")
      .eq("registration_code", code)
      .eq("status", "completed")
      .maybeSingle();

    if (paymentError) {
      console.error("Database query error:", paymentError);
      return new Response(
        JSON.stringify({ valid: false, error: "Error verifying code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!payment) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid registration code. Please check your ticket email." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already registered
    const { data: existingReg, error: regError } = await supabase
      .from("registrations")
      .select("id")
      .eq("registration_code", code)
      .maybeSingle();

    if (regError) {
      console.error("Registration check error:", regError);
      return new Response(
        JSON.stringify({ valid: false, error: "Error checking registration status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingReg) {
      return new Response(
        JSON.stringify({ valid: false, error: "This code has already been used to register." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return only the email (masked for privacy) and validity status
    const email = payment.email || "";
    
    console.log("Registration code verified successfully");

    return new Response(
      JSON.stringify({
        valid: true,
        email: email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
