import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
