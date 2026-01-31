import { supabase } from '@/integrations/supabase/client';

export interface ScanRequest {
  type: 'text' | 'email' | 'url' | 'image';
  content: string;
}

export interface ScanResponse {
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

export async function scanContent(request: ScanRequest): Promise<ScanResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('scan', {
      body: request,
    });

    if (error) {
      console.error('Scan API error:', error);
      return FALLBACK_RESPONSE;
    }

    if (data.error) {
      console.error('Scan error:', data.error);
      return FALLBACK_RESPONSE;
    }

    return data as ScanResponse;
  } catch (error) {
    console.error('Failed to call scan API:', error);
    return FALLBACK_RESPONSE;
  }
}

export async function scanText(content: string): Promise<ScanResponse> {
  return scanContent({ type: 'text', content });
}

export async function scanEmail(content: string): Promise<ScanResponse> {
  return scanContent({ type: 'email', content });
}

export async function scanUrl(url: string): Promise<ScanResponse> {
  return scanContent({ type: 'url', content: url });
}

export async function scanImage(extractedText: string): Promise<ScanResponse> {
  return scanContent({ type: 'image', content: extractedText });
}
