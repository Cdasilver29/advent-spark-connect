import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Safaricom M-Pesa callback IP ranges (Kenya)
// These should be verified with Safaricom's official documentation
const ALLOWED_IP_RANGES = [
  "196.201.214.", // Safaricom IP range
  "196.201.212.", // Safaricom IP range
  "196.201.213.", // Safaricom IP range
  "41.215.112.",  // Safaricom IP range
  "41.215.113.",  // Safaricom IP range
  "41.215.114.",  // Safaricom IP range
];

// In development/testing, allow localhost and internal IPs
const DEV_ALLOWED_IPS = ["127.0.0.1", "::1", "localhost"];

function isAllowedIP(ip: string | null): boolean {
  if (!ip) return false;
  
  // Check for development IPs (only in non-production)
  const isProduction = Deno.env.get("ENVIRONMENT") === "production";
  if (!isProduction && DEV_ALLOWED_IPS.some(devIP => ip.includes(devIP))) {
    console.log("Development IP allowed:", ip);
    return true;
  }
  
  // Check if IP starts with any allowed Safaricom range
  const isAllowed = ALLOWED_IP_RANGES.some(range => ip.startsWith(range));
  console.log(`IP validation: ${ip} - ${isAllowed ? "ALLOWED" : "BLOCKED"}`);
  return isAllowed;
}

interface MPesaCallbackItem {
  Name: string;
  Value: string | number;
}

interface MPesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: MPesaCallbackItem[];
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from various headers (Supabase edge functions)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("x-real-ip") 
      || req.headers.get("cf-connecting-ip")
      || null;
    
    console.log("Callback received from IP:", clientIP);
    
    // Validate source IP
    if (!isAllowedIP(clientIP)) {
      console.error("SECURITY: Callback from unauthorized IP:", clientIP);
      return new Response(
        JSON.stringify({ ResultCode: 1, ResultDesc: "Unauthorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const callback: MPesaCallback = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(callback, null, 2));

    const { stkCallback } = callback.Body;
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    console.log("Processing callback for checkout:", CheckoutRequestID);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const internalApiSecret = Deno.env.get("INTERNAL_API_SECRET");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: Verify the checkout_request_id exists in our database
    // This prevents processing callbacks for non-existent transactions
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("checkout_request_id", CheckoutRequestID)
      .single();

    if (!existingPayment) {
      console.error("SECURITY: Callback for unknown checkout_request_id:", CheckoutRequestID);
      return new Response(
        JSON.stringify({ ResultCode: 1, ResultDesc: "Unknown transaction" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent reprocessing completed/failed payments
    if (existingPayment.status !== "pending") {
      console.log("Payment already processed, status:", existingPayment.status);
      return new Response(
        JSON.stringify({ ResultCode: 0, ResultDesc: "Already processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract metadata if payment was successful
    let mpesaReceiptNumber = null;
    let transactionDate = null;
    let phoneNumber = null;
    let amount = null;

    if (ResultCode === 0 && CallbackMetadata) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") {
          mpesaReceiptNumber = String(item.Value);
        }
        if (item.Name === "TransactionDate") {
          transactionDate = String(item.Value);
        }
        if (item.Name === "PhoneNumber") {
          phoneNumber = String(item.Value);
        }
        if (item.Name === "Amount") {
          amount = Number(item.Value);
        }
      }
      console.log("Payment successful - Receipt:", mpesaReceiptNumber);
    } else {
      console.log("Payment failed or cancelled - Code:", ResultCode);
    }

    // Update payment record in database
    const { data: paymentData, error: updateError } = await supabase
      .from("payments")
      .update({
        status: ResultCode === 0 ? "completed" : "failed",
        result_code: ResultCode,
        result_desc: ResultDesc,
        mpesa_receipt_number: mpesaReceiptNumber,
        transaction_date: transactionDate,
      })
      .eq("checkout_request_id", CheckoutRequestID)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
    } else {
      console.log("Payment record updated successfully");

      // If payment was successful, send ticket email
      if (ResultCode === 0 && paymentData?.email) {
        console.log("Sending ticket email to:", paymentData.email);
        
        if (!internalApiSecret) {
          console.error("INTERNAL_API_SECRET not configured - cannot send email securely");
        } else {
          try {
            // Call the email function with internal secret for authentication
            const emailFunctionUrl = `${supabaseUrl}/functions/v1/send-ticket-email`;
            
            const emailResponse = await fetch(emailFunctionUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseKey}`,
                "x-internal-secret": internalApiSecret,
              },
              body: JSON.stringify({
                email: paymentData.email,
                ticketType: paymentData.ticket_type,
                amount: paymentData.amount,
                mpesaReceipt: mpesaReceiptNumber,
                phoneNumber: paymentData.phone_number,
                transactionDate: transactionDate,
              }),
            });

            const emailResult = await emailResponse.json();
            
            if (!emailResponse.ok || !emailResult.success) {
              console.error("Failed to send ticket email:", emailResult);
            } else {
              console.log("Ticket email sent successfully");
            }
          } catch (emailError) {
            console.error("Email sending error:", emailError);
          }
        }
      }
    }

    // Return success response to M-Pesa
    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Callback processing error:", error);
    return new Response(
      JSON.stringify({ ResultCode: 1, ResultDesc: "Processing error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
