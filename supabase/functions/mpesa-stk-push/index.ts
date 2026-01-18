import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  ticketType: string;
  email?: string;
}

interface MPesaAuthResponse {
  access_token: string;
  expires_in: string;
}

interface MPesaSTKResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MINUTES = 5;
const MAX_REQUESTS_PER_PHONE = 3;

// Allowed ticket types
const VALID_TICKET_TYPES = [
  "Early Bird (Ages 21-28)",
  "Early Bird (Ages 28-40+)",
  "Regular (Ages 21-28)",
  "Regular (Ages 28-40+)",
  "VIP (Ages 21-28)",
  "VIP (Ages 28-40+)"
];

// Validation functions
function validatePhoneNumber(phone: string): { valid: boolean; error?: string; formatted?: string } {
  if (!phone || typeof phone !== "string") {
    return { valid: false, error: "Phone number is required" };
  }
  
  // Remove all non-numeric characters
  let cleaned = phone.replace(/[^0-9]/g, "");
  
  // Convert to 254 format
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith("254")) {
    cleaned = "254" + cleaned;
  }
  
  // Validate length (should be 12 digits: 254 + 9 digits)
  if (cleaned.length !== 12) {
    return { valid: false, error: "Phone number must be a valid Kenyan number (e.g., 0712345678 or 254712345678)" };
  }
  
  // Validate it starts with valid Kenyan prefixes after 254
  const validPrefixes = ["7", "1"]; // Safaricom, Airtel, Telkom
  const afterCode = cleaned.substring(3, 4);
  if (!validPrefixes.includes(afterCode)) {
    return { valid: false, error: "Phone number must be a valid Kenyan mobile number" };
  }
  
  return { valid: true, formatted: cleaned };
}

function validateAmount(amount: unknown): { valid: boolean; error?: string; value?: number } {
  if (amount === undefined || amount === null) {
    return { valid: false, error: "Amount is required" };
  }
  
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return { valid: false, error: "Amount must be a valid number" };
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: "Amount must be greater than zero" };
  }
  
  if (numAmount < 100) {
    return { valid: false, error: "Minimum amount is 100 KES" };
  }
  
  if (numAmount > 100000) {
    return { valid: false, error: "Maximum amount is 100,000 KES" };
  }
  
  // M-Pesa only accepts whole numbers
  if (!Number.isInteger(numAmount)) {
    return { valid: true, value: Math.round(numAmount) };
  }
  
  return { valid: true, value: numAmount };
}

function validateTicketType(ticketType: string): { valid: boolean; error?: string } {
  if (!ticketType || typeof ticketType !== "string") {
    return { valid: false, error: "Ticket type is required" };
  }
  
  if (!VALID_TICKET_TYPES.includes(ticketType)) {
    return { valid: false, error: `Invalid ticket type. Must be one of: ${VALID_TICKET_TYPES.join(", ")}` };
  }
  
  return { valid: true };
}

function validateEmail(email: string | undefined): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: true }; // Email is optional
  }
  
  if (typeof email !== "string") {
    return { valid: false, error: "Email must be a string" };
  }
  
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  
  if (email.length > 255) {
    return { valid: false, error: "Email must be less than 255 characters" };
  }
  
  return { valid: true };
}

// Rate limiting check using database
async function checkRateLimit(supabase: any, phoneNumber: string): Promise<{ allowed: boolean; error?: string }> {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - RATE_LIMIT_WINDOW_MINUTES);
  
  const { count, error } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("phone_number", phoneNumber)
    .gte("created_at", windowStart.toISOString());
  
  if (error) {
    console.error("Rate limit check error:", error);
    // Allow request if rate limit check fails (fail open for availability)
    return { allowed: true };
  }
  
  if (count !== null && count >= MAX_REQUESTS_PER_PHONE) {
    return { 
      allowed: false, 
      error: `Too many payment requests. Please wait ${RATE_LIMIT_WINDOW_MINUTES} minutes before trying again.` 
    };
  }
  
  return { allowed: true };
}

// Get M-Pesa OAuth token
async function getMpesaToken(): Promise<string> {
  const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }

  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OAuth error:", errorText);
    throw new Error("Failed to get M-Pesa access token");
  }

  const data: MPesaAuthResponse = await response.json();
  console.log("OAuth token obtained successfully");
  return data.access_token;
}

// Generate timestamp in format YYYYMMDDHHmmss
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate password for STK Push
function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  return btoa(`${shortcode}${passkey}${timestamp}`);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount, ticketType, email }: STKPushRequest = await req.json();

    console.log("Processing STK Push request:", { phoneNumber, amount, ticketType, email });

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      console.error("Phone validation failed:", phoneValidation.error);
      return new Response(
        JSON.stringify({ error: phoneValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      console.error("Amount validation failed:", amountValidation.error);
      return new Response(
        JSON.stringify({ error: amountValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate ticket type
    const ticketValidation = validateTicketType(ticketType);
    if (!ticketValidation.valid) {
      console.error("Ticket type validation failed:", ticketValidation.error);
      return new Response(
        JSON.stringify({ error: ticketValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email (optional)
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      console.error("Email validation failed:", emailValidation.error);
      return new Response(
        JSON.stringify({ error: emailValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formattedPhone = phoneValidation.formatted!;
    const validatedAmount = amountValidation.value!;

    console.log("Validated STK Push request:", { formattedPhone, validatedAmount, ticketType, email });

    // Initialize Supabase client for rate limiting and database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit before processing
    const rateLimitCheck = await checkRateLimit(supabase, formattedPhone);
    if (!rateLimitCheck.allowed) {
      console.warn("Rate limit exceeded for phone:", formattedPhone);
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get environment variables
    const shortcode = Deno.env.get("MPESA_SHORTCODE") || "174379";
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL");

    if (!passkey || !callbackUrl) {
      console.error("M-Pesa configuration missing");
      return new Response(
        JSON.stringify({ error: "M-Pesa configuration incomplete" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get OAuth token
    const token = await getMpesaToken();
    
    // Generate timestamp and password
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    console.log("Initiating STK Push to:", formattedPhone);

    // STK Push payload
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: validatedAmount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: "AdventistSpark",
      TransactionDesc: `Ticket: ${ticketType}`,
    };

    // Make STK Push request
    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkResult: MPesaSTKResponse = await stkResponse.json();
    console.log("STK Push response:", stkResult);

    if (stkResult.ResponseCode !== "0") {
      console.error("STK Push failed:", stkResult);
      return new Response(
        JSON.stringify({ 
          error: "Failed to initiate payment", 
          details: stkResult.ResponseDescription 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save payment record to database
    const { error: dbError } = await supabase.from("payments").insert({
      phone_number: formattedPhone,
      amount: validatedAmount,
      ticket_type: ticketType,
      merchant_request_id: stkResult.MerchantRequestID,
      checkout_request_id: stkResult.CheckoutRequestID,
      status: "pending",
      email: email || null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: stkResult.CustomerMessage,
        checkoutRequestId: stkResult.CheckoutRequestID,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("STK Push error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
