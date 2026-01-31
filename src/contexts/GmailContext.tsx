import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GmailUser {
  email: string;
  name?: string;
  picture?: string;
}

interface GmailEmail {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

interface GmailContextType {
  isConnected: boolean;
  isLoading: boolean;
  user: GmailUser | null;
  emails: GmailEmail[];
  error: string | null;
  connectGmail: () => Promise<void>;
  disconnectGmail: () => void;
  fetchEmails: () => Promise<void>;
  getEmailDetail: (messageId: string) => Promise<{ body: string; subject: string; from: string; date: string } | null>;
}

const GmailContext = createContext<GmailContextType | null>(null);

const GMAIL_STORAGE_KEY = 'clicksafe_gmail_auth';

export function GmailProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GmailUser | null>(null);
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check for stored auth on mount
  useEffect(() => {
    const stored = localStorage.getItem(GMAIL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.access_token && parsed.user) {
          setAccessToken(parsed.access_token);
          setUser(parsed.user);
          setIsConnected(true);
        }
      } catch (e) {
        console.error('Failed to parse stored Gmail auth:', e);
        localStorage.removeItem(GMAIL_STORAGE_KEY);
      }
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && !isConnected) {
        setIsLoading(true);
        setError(null);
        
        try {
          // Get the redirect URI (current origin + path without query params)
          const redirectUri = `${window.location.origin}/inbox`;
          
          const { data, error: fnError } = await supabase.functions.invoke('gmail-callback', {
            body: { code, redirect_uri: redirectUri },
          });

          if (fnError) throw new Error(fnError.message);
          if (data.error) throw new Error(data.error);

          // Store the auth data
          localStorage.setItem(GMAIL_STORAGE_KEY, JSON.stringify({
            access_token: data.access_token,
            user: data.user,
          }));

          setAccessToken(data.access_token);
          setUser({
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
          });
          setIsConnected(true);

          // Clean up URL
          window.history.replaceState({}, document.title, '/inbox');
        } catch (e) {
          console.error('OAuth callback failed:', e);
          setError(e instanceof Error ? e.message : 'Failed to complete Gmail authentication');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [isConnected]);

  const connectGmail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const redirectUri = `${window.location.origin}/inbox`;

      const { data, error: fnError } = await supabase.functions.invoke('gmail-auth', {
        body: { redirect_uri: redirectUri },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      if (data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (e) {
      console.error('Failed to initiate Gmail connection:', e);
      setError(e instanceof Error ? e.message : 'Failed to connect to Gmail');
      setIsLoading(false);
    }
  }, []);

  const disconnectGmail = useCallback(() => {
    localStorage.removeItem(GMAIL_STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
    setEmails([]);
    setIsConnected(false);
    setError(null);
  }, []);

  const fetchEmails = useCallback(async () => {
    if (!accessToken) {
      setError('Not connected to Gmail');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('gmail-emails', {
        body: { access_token: accessToken },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) {
        // Token might be expired
        if (data.error.includes('401') || data.error.includes('unauthorized')) {
          disconnectGmail();
          throw new Error('Gmail session expired. Please reconnect.');
        }
        throw new Error(data.error);
      }

      setEmails(data.emails || []);
    } catch (e) {
      console.error('Failed to fetch emails:', e);
      setError(e instanceof Error ? e.message : 'Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, disconnectGmail]);

  const getEmailDetail = useCallback(async (messageId: string) => {
    if (!accessToken) {
      return null;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('gmail-emails', {
        body: { access_token: accessToken, message_id: messageId },
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      return {
        body: data.body,
        subject: data.subject,
        from: data.from,
        date: data.date,
      };
    } catch (e) {
      console.error('Failed to fetch email detail:', e);
      return null;
    }
  }, [accessToken]);

  return (
    <GmailContext.Provider
      value={{
        isConnected,
        isLoading,
        user,
        emails,
        error,
        connectGmail,
        disconnectGmail,
        fetchEmails,
        getEmailDetail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}

export function useGmail() {
  const context = useContext(GmailContext);
  if (!context) {
    throw new Error('useGmail must be used within a GmailProvider');
  }
  return context;
}
