import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ScamReportRequest {
  timestamp: string;
  riskScore: number;
  riskLevel: string;
  category: string;
  redFlags: string[];
  originalContent: string;
  explanation?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reportData: ScamReportRequest = await req.json();
    console.log("Received scam report:", reportData);

    // Validate required fields
    if (!reportData.riskScore || !reportData.riskLevel || !reportData.category) {
      throw new Error("Missing required fields in scam report");
    }

    const redFlagsList = reportData.redFlags?.length > 0 
      ? reportData.redFlags.map(flag => `<li style="margin-bottom: 8px;">🚩 ${flag}</li>`).join('')
      : '<li>No specific red flags detected</li>';

    const truncatedContent = reportData.originalContent?.substring(0, 1000) || 'No content provided';
    const contentPreview = reportData.originalContent?.length > 1000 
      ? truncatedContent + '... [truncated]' 
      : truncatedContent;

    const riskColor = reportData.riskLevel === 'Critical' || reportData.riskLevel === 'High' 
      ? '#ef4444' 
      : reportData.riskLevel === 'Medium' 
        ? '#f59e0b' 
        : '#22c55e';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Scam Report from ClickSafe</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a1a2f; color: #e5e7eb; padding: 40px 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a2d4a; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00bfff 0%, #3b82f6 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #0a1a2f; font-size: 24px; font-weight: bold;">
              🛡️ ClickSafe Scam Report
            </h1>
            <p style="margin: 8px 0 0; color: #0a1a2f; opacity: 0.8; font-size: 14px;">
              Automated Report • ${reportData.timestamp}
            </p>
          </div>

          <!-- Risk Badge -->
          <div style="padding: 24px; text-align: center; border-bottom: 1px solid #334155;">
            <div style="display: inline-block; background-color: ${riskColor}20; border: 2px solid ${riskColor}; border-radius: 12px; padding: 16px 32px;">
              <div style="font-size: 36px; font-weight: bold; color: ${riskColor};">
                ${reportData.riskScore}/100
              </div>
              <div style="font-size: 14px; color: ${riskColor}; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                ${reportData.riskLevel} Risk
              </div>
            </div>
          </div>

          <!-- Category -->
          <div style="padding: 24px; border-bottom: 1px solid #334155;">
            <h2 style="margin: 0 0 8px; color: #00bfff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Scam Category
            </h2>
            <p style="margin: 0; font-size: 18px; color: #f1f5f9;">
              ${reportData.category}
            </p>
          </div>

          <!-- Red Flags -->
          <div style="padding: 24px; border-bottom: 1px solid #334155;">
            <h2 style="margin: 0 0 16px; color: #ef4444; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Red Flags Detected
            </h2>
            <ul style="margin: 0; padding-left: 0; list-style: none; color: #f1f5f9; font-size: 14px; line-height: 1.6;">
              ${redFlagsList}
            </ul>
          </div>

          ${reportData.explanation ? `
          <!-- Explanation -->
          <div style="padding: 24px; border-bottom: 1px solid #334155;">
            <h2 style="margin: 0 0 12px; color: #00bfff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Analysis
            </h2>
            <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
              ${reportData.explanation}
            </p>
          </div>
          ` : ''}

          <!-- Original Content -->
          <div style="padding: 24px;">
            <h2 style="margin: 0 0 12px; color: #00bfff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Original Scanned Content
            </h2>
            <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 12px; color: #94a3b8; white-space: pre-wrap; word-break: break-word; max-height: 200px; overflow-y: auto;">
${contentPreview}
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              This report was generated by ClickSafe - Protecting students from online scams
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "ClickSafe <onboarding@resend.dev>",
      to: ["teamhacktivate1@gmail.com"],
      subject: "Scam Report from ClickSafe",
      html: emailHtml,
    });

    console.log("Scam report email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending scam report email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send report" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
