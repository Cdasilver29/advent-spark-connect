import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TicketEmailRequest {
  email: string;
  ticketType: string;
  amount: number;
  mpesaReceipt: string;
  phoneNumber: string;
  transactionDate: string;
}

// Generate QR code as base64 using a public API
async function generateQRCode(data: string): Promise<string> {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  const response = await fetch(qrApiUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  return `data:image/png;base64,${base64}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, ticketType, amount, mpesaReceipt, phoneNumber, transactionDate }: TicketEmailRequest = await req.json();

    console.log("Sending ticket email to:", email);

    // Generate QR code with ticket information
    const ticketData = JSON.stringify({
      receipt: mpesaReceipt,
      ticket: ticketType,
      phone: phoneNumber,
      date: transactionDate,
    });
    const qrCodeBase64 = await generateQRCode(ticketData);

    // Format transaction date
    const formattedDate = transactionDate 
      ? new Date(
          transactionDate.slice(0, 4) + '-' + 
          transactionDate.slice(4, 6) + '-' + 
          transactionDate.slice(6, 8) + 'T' +
          transactionDate.slice(8, 10) + ':' +
          transactionDate.slice(10, 12) + ':' +
          transactionDate.slice(12, 14)
        ).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' })
      : new Date().toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Adventist Singles Spark Ticket</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #003366 0%, #002244 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFD700; font-size: 28px; font-weight: bold;">❤️ Adventist Singles Spark</h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Your Ticket Confirmation</p>
            </td>
          </tr>
          
          <!-- Success Badge -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center;">
              <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                ✓ Payment Successful
              </div>
            </td>
          </tr>
          
          <!-- Ticket Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px; color: #003366; font-size: 20px; text-align: center;">Ticket Details</h2>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 14px;">Ticket Type</span>
                        </td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${ticketType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 14px;">Amount Paid</span>
                        </td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <span style="color: #166534; font-size: 14px; font-weight: 600;">KES ${amount.toLocaleString()}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 14px;">M-Pesa Receipt</span>
                        </td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${mpesaReceipt}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <span style="color: #64748b; font-size: 14px;">Transaction Date</span>
                        </td>
                        <td style="padding: 10px 0; text-align: right;">
                          <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${formattedDate}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- QR Code -->
          <tr>
            <td style="padding: 20px 40px; text-align: center;">
              <div style="background-color: #ffffff; border: 2px dashed #003366; border-radius: 12px; padding: 24px; display: inline-block;">
                <p style="margin: 0 0 16px; color: #003366; font-size: 16px; font-weight: 600;">Your Entry QR Code</p>
                <img src="${qrCodeBase64}" alt="Ticket QR Code" style="width: 200px; height: 200px; display: block; margin: 0 auto;" />
                <p style="margin: 16px 0 0; color: #64748b; font-size: 12px;">Present this QR code at the event entrance</p>
              </div>
            </td>
          </tr>
          
          <!-- Important Info -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 12px; color: #92400e; font-size: 16px;">📋 Important Information</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.6;">
                  <li>Please arrive at least 15 minutes before the event starts</li>
                  <li>Bring a valid ID for verification</li>
                  <li>Screenshot or print this ticket for entry</li>
                  <li>Dress code: Smart Casual</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #FFD700; font-size: 14px; font-weight: 600; font-style: italic;">"Equally Yoked" - 2 Corinthians 6:14</p>
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">We can't wait to see you at the event!</p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Questions? Contact us at info@adventistspark.com<br>
                © ${new Date().getFullYear()} Adventist Singles Spark. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Adventist Singles Spark <onboarding@resend.dev>",
      to: [email],
      subject: `🎟️ Your ${ticketType} Ticket - Adventist Singles Spark`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending ticket email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
