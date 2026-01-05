import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const INTERNAL_API_SECRET = Deno.env.get("INTERNAL_API_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

interface ReminderEmailRequest {
  daysBeforeEvent?: number;
  eventDate: string;
  venue: string;
  eventTime: string;
  testEmail?: string; // For testing, send to specific email only
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate internal API secret
    const providedSecret = req.headers.get("x-internal-secret");
    
    if (!INTERNAL_API_SECRET) {
      console.error("INTERNAL_API_SECRET not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!providedSecret || providedSecret !== INTERNAL_API_SECRET) {
      console.warn("Unauthorized reminder request attempt");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { eventDate, venue, eventTime, testEmail }: ReminderEmailRequest = await req.json();

    if (!eventDate || !venue || !eventTime) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: eventDate, venue, eventTime" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get registrations that haven't received reminders
    let query = supabase
      .from("registrations")
      .select("id, email, full_name, registration_code")
      .eq("reminder_sent", false);

    if (testEmail) {
      query = query.eq("email", testEmail);
    }

    const { data: registrations, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching registrations:", fetchError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch registrations" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!registrations || registrations.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No registrations to send reminders to", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending reminder emails to ${registrations.length} registrations`);

    let sentCount = 0;
    const errors: string[] = [];

    for (const reg of registrations) {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Reminder - Singles Spark</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #003366 0%, #002244 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFD700; font-size: 28px; font-weight: bold;">❤️ Singles Spark Event Reminder</h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">The event is coming up soon!</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <h2 style="margin: 0; color: #003366; font-size: 22px;">Dear ${reg.full_name},</h2>
              <p style="margin: 16px 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We're excited to remind you that the Singles Spark event is coming up! Here are the important details you'll need.
              </p>
            </td>
          </tr>

          <!-- Event Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 20px; color: #003366; font-size: 20px; text-align: center;">📅 Event Details</h3>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">📆 Date</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                      <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${eventDate}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                      <span style="color: #64748b; font-size: 14px;">🕐 Time</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                      <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${eventTime}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color: #64748b; font-size: 14px;">📍 Venue</span>
                    </td>
                    <td style="padding: 10px 0; text-align: right;">
                      <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${venue}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Your Registration Code -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background: linear-gradient(135deg, #003366 0%, #002244 100%); border-radius: 12px; padding: 24px; text-align: center;">
                <p style="margin: 0 0 8px; color: rgba(255, 255, 255, 0.8); font-size: 14px;">YOUR REGISTRATION CODE</p>
                <p style="margin: 0; color: #FFD700; font-size: 32px; font-weight: bold; letter-spacing: 6px; font-family: monospace;">${reg.registration_code}</p>
                <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 12px;">Present this at check-in</p>
              </div>
            </td>
          </tr>

          <!-- What to Bring -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; border-left: 4px solid #003366;">
                <h3 style="margin: 0 0 16px; color: #003366; font-size: 18px;">🎒 What to Bring</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #1e40af; font-size: 14px; line-height: 2;">
                  <li><strong>Your QR Code Ticket</strong> - from your original ticket email (screenshot or print)</li>
                  <li><strong>Valid ID</strong> - for verification at check-in</li>
                  <li><strong>A Positive Attitude</strong> - come ready to connect!</li>
                  <li><strong>Your Bible</strong> - for faith discussions and devotions</li>
                  <li><strong>Pen & Paper/Notebook</strong> - for notes and contact exchanges</li>
                  <li><strong>Your Best Smile</strong> - first impressions matter!</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Dress Code -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 12px; color: #92400e; font-size: 18px;">👔 Dress Code: Smart Casual</h3>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                  Dress modestly and appropriately for a faith-based event. Think church-ready but comfortable - you'll be participating in various activities!
                </p>
              </div>
            </td>
          </tr>

          <!-- Venue Directions -->
          <tr>
            <td style="padding: 20px 40px;">
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; border-left: 4px solid #22c55e;">
                <h3 style="margin: 0 0 12px; color: #166534; font-size: 18px;">🗺️ Getting There</h3>
                <p style="margin: 0 0 12px; color: #166534; font-size: 14px; line-height: 1.6;">
                  <strong>Venue:</strong> ${venue}
                </p>
                <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
                  We recommend arriving <strong>15-30 minutes early</strong> for check-in. Use Google Maps or your preferred navigation app to find directions to the venue. If you have any trouble finding the location, contact the event coordinators.
                </p>
              </div>
            </td>
          </tr>

          <!-- Important Reminders -->
          <tr>
            <td style="padding: 20px 40px;">
              <h3 style="margin: 0 0 16px; color: #003366; font-size: 18px;">⚡ Important Reminders</h3>
              <ul style="margin: 0; padding: 0 0 0 20px; color: #4a5568; font-size: 14px; line-height: 2;">
                <li>Arrive 15-30 minutes early for smooth check-in</li>
                <li>Bring your ticket QR code (digital or printed)</li>
                <li>Mute your phone during activities</li>
                <li>Be open, respectful, and ready to make genuine connections</li>
                <li>No refunds for no-shows - please let us know if you can't make it</li>
              </ul>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #FFD700; font-size: 14px; font-weight: 600; font-style: italic;">"Equally Yoked" - 2 Corinthians 6:14</p>
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">We can't wait to see you there!</p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Questions? Contact us at info@adventistspark.com<br>
                © ${new Date().getFullYear()} Singles Spark. All rights reserved.
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

      try {
        await resend.emails.send({
          from: "Singles Spark <onboarding@resend.dev>",
          to: [reg.email],
          subject: `📅 Event Reminder: Singles Spark on ${eventDate} - Don't Forget!`,
          html: emailHtml,
        });

        // Mark as sent
        await supabase
          .from("registrations")
          .update({
            reminder_sent: true,
            reminder_sent_at: new Date().toISOString(),
          })
          .eq("id", reg.id);

        sentCount++;
        console.log(`Reminder sent to ${reg.email}`);
      } catch (emailError: any) {
        console.error(`Failed to send reminder to ${reg.email}:`, emailError);
        errors.push(`${reg.email}: ${emailError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${sentCount} reminder emails`,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-reminder-emails:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
