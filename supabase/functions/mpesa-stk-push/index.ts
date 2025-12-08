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

// Format phone number to 254 format
function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/\s+/g, "").replace(/[^0-9]/g, "");
  
  if (formatted.startsWith("0")) {
    formatted = "254" + formatted.substring(1);
  } else if (formatted.startsWith("+254")) {
    formatted = formatted.substring(1);
  } else if (!formatted.startsWith("254")) {
    formatted = "254" + formatted;
  }
  
  return formatted;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount, ticketType }: STKPushRequest = await req.json();

    // Validate input
    if (!phoneNumber || !amount || !ticketType) {
      console.error("Missing required fields:", { phoneNumber, amount, ticketType });
      return new Response(
        JSON.stringify({ error: "Phone number, amount, and ticket type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing STK Push request:", { phoneNumber, amount, ticketType });

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
    const formattedPhone = formatPhoneNumber(phoneNumber);

    console.log("Initiating STK Push to:", formattedPhone);

    // STK Push payload
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("payments").insert({
      phone_number: formattedPhone,
      amount: amount,
      ticket_type: ticketType,
      merchant_request_id: stkResult.MerchantRequestID,
      checkout_request_id: stkResult.CheckoutRequestID,
      status: "pending",
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
