import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
}

interface GmailMessageDetail {
  id: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{
      mimeType: string;
      body?: { data?: string };
      parts?: Array<{
        mimeType: string;
        body?: { data?: string };
      }>;
    }>;
  };
  internalDate: string;
}

function decodeBase64Url(data: string): string {
  // Convert base64url to base64
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  
  try {
    return atob(padded);
  } catch {
    return '';
  }
}

function extractEmailBody(payload: GmailMessageDetail['payload']): string {
  // Try to get plain text body first
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Check parts for text/plain or text/html
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
      // Check nested parts (for multipart/alternative)
      if (part.parts) {
        for (const subPart of part.parts) {
          if (subPart.mimeType === 'text/plain' && subPart.body?.data) {
            return decodeBase64Url(subPart.body.data);
          }
        }
      }
    }
    // Fall back to HTML if no plain text
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        const html = decodeBase64Url(part.body.data);
        // Strip HTML tags for a basic text version
        return html.replace(/<[^>]*>/g, '').trim();
      }
    }
  }

  return '';
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string): string {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || '';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { access_token, message_id } = await req.json();

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: 'Access token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If message_id is provided, fetch a single email detail
    if (message_id) {
      console.log(`Fetching email detail for: ${message_id}`);
      
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message_id}?format=full`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );

      if (!detailResponse.ok) {
        const errorText = await detailResponse.text();
        console.error('Failed to fetch email detail:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch email detail' }),
          { status: detailResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const messageDetail: GmailMessageDetail = await detailResponse.json();
      const headers = messageDetail.payload.headers;

      return new Response(
        JSON.stringify({
          id: messageDetail.id,
          subject: getHeader(headers, 'Subject'),
          from: getHeader(headers, 'From'),
          to: getHeader(headers, 'To'),
          date: getHeader(headers, 'Date'),
          snippet: messageDetail.snippet,
          body: extractEmailBody(messageDetail.payload),
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch list of last 20 emails
    console.log('Fetching last 20 emails from Gmail...');
    
    const listResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&labelIds=INBOX',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Failed to fetch emails:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch emails' }),
        { status: listResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const listData = await listResponse.json();
    const messages: GmailMessage[] = listData.messages || [];

    console.log(`Found ${messages.length} emails, fetching details...`);

    // Fetch details for each message
    const emailPromises = messages.map(async (msg: GmailMessage) => {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        }
      );

      if (!detailResponse.ok) {
        console.error(`Failed to fetch details for message ${msg.id}`);
        return null;
      }

      const detail = await detailResponse.json();
      const headers = detail.payload.headers;

      return {
        id: detail.id,
        subject: getHeader(headers, 'Subject'),
        from: getHeader(headers, 'From'),
        date: getHeader(headers, 'Date'),
        snippet: detail.snippet,
      };
    });

    const emails = (await Promise.all(emailPromises)).filter(Boolean);
    console.log(`Successfully fetched ${emails.length} email details`);

    return new Response(
      JSON.stringify({ emails }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error fetching emails:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
