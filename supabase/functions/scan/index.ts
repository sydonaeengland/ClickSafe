import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScanRequest {
  type: 'text' | 'email' | 'url' | 'image';
  content: string;
}

interface ScanResponse {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Phishing' | 'Impersonation' | 'Payment Scam' | 'Job Scam' | 'Account Takeover' | 'Other';
  categoryConfidence: number;
  redFlags: string[];
  explanation: string;
  safetyAdvice: string[];
  safeToOpen: boolean;
}

const FALLBACK_RESPONSE: ScanResponse = {
  riskScore: 50,
  riskLevel: 'Medium',
  category: 'Other',
  categoryConfidence: 0.5,
  redFlags: ['Unable to fully analyze content'],
  explanation: 'The content could not be fully analyzed. Exercise caution and verify through official channels before taking any action.',
  safetyAdvice: [
    'Do not click on any links until verified',
    'Do not share personal or financial information',
    'Contact the sender through official channels to verify',
    'When in doubt, consult IT security or a trusted advisor'
  ],
  safeToOpen: false
};

const SYSTEM_PROMPT = `You are an expert scam detection AI. Analyze the provided content and identify potential scams, phishing attempts, or fraudulent messages.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "riskScore": <number 0-100>,
  "riskLevel": "<Low | Medium | High | Critical>",
  "category": "<Phishing | Impersonation | Payment Scam | Job Scam | Account Takeover | Other>",
  "categoryConfidence": <number 0.0-1.0>,
  "redFlags": ["<list of specific red flags found>"],
  "explanation": "<brief explanation of findings>",
  "safetyAdvice": ["<list of actionable safety recommendations>"],
  "safeToOpen": <boolean>
}

Risk level guidelines:
- Low (0-25): Appears legitimate, no significant red flags
- Medium (26-50): Some concerns, needs verification
- High (51-75): Multiple red flags, likely suspicious
- Critical (76-100): Clear scam indicators, do not engage

Category definitions:
- Phishing: Attempts to steal credentials or personal info via fake websites/forms
- Impersonation: Pretending to be a trusted entity (bank, government, company)
- Payment Scam: Requesting money transfers, gift cards, or cryptocurrency
- Job Scam: Fake job offers, work-from-home schemes
- Account Takeover: Attempts to gain access to accounts
- Other: Doesn't fit above categories

Key red flags to look for:
- Urgency tactics ("Act now!", "24 hours only")
- Requests for sensitive information
- Suspicious or shortened links
- Grammar/spelling errors from "official" sources
- Too-good-to-be-true offers
- Mismatched sender addresses/domains
- Threats or fear-based messaging
- Requests for unusual payment methods

IMPORTANT: Do not claim certainty. If content is ambiguous, default to Medium risk with verification advice.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ ...FALLBACK_RESPONSE, explanation: 'AI service not configured. Using fallback analysis.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, content }: ScanRequest = await req.json();

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scanning ${type} content (${content.length} chars)...`);

    const userPrompt = `Analyze the following ${type} content for potential scams or phishing attempts:

---
${content}
---

Provide your analysis in the exact JSON format specified.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ ...FALLBACK_RESPONSE, explanation: 'AI analysis temporarily unavailable. Using fallback safety assessment.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No AI response content');
      return new Response(
        JSON.stringify(FALLBACK_RESPONSE),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const parsed: ScanResponse = JSON.parse(aiResponse);
      
      // Validate and sanitize the response
      const validatedResponse: ScanResponse = {
        riskScore: Math.max(0, Math.min(100, parsed.riskScore || 50)),
        riskLevel: ['Low', 'Medium', 'High', 'Critical'].includes(parsed.riskLevel) 
          ? parsed.riskLevel 
          : 'Medium',
        category: ['Phishing', 'Impersonation', 'Payment Scam', 'Job Scam', 'Account Takeover', 'Other'].includes(parsed.category)
          ? parsed.category
          : 'Other',
        categoryConfidence: Math.max(0, Math.min(1, parsed.categoryConfidence || 0.5)),
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        explanation: parsed.explanation || 'Analysis complete.',
        safetyAdvice: Array.isArray(parsed.safetyAdvice) ? parsed.safetyAdvice : FALLBACK_RESPONSE.safetyAdvice,
        safeToOpen: typeof parsed.safeToOpen === 'boolean' ? parsed.safeToOpen : false
      };

      console.log(`Scan complete: ${validatedResponse.riskLevel} risk (${validatedResponse.riskScore})`);

      return new Response(
        JSON.stringify(validatedResponse),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, aiResponse);
      return new Response(
        JSON.stringify(FALLBACK_RESPONSE),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Scan error:', error);
    return new Response(
      JSON.stringify({ ...FALLBACK_RESPONSE, explanation: 'An error occurred during analysis. Using fallback safety assessment.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
