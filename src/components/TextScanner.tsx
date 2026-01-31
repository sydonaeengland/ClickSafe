import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { scanText, type ScanResponse } from '@/lib/scanApi';

interface TextScannerProps {
  onScanComplete: (result: ScanResponse, originalText: string) => void;
}

export function TextScanner({ onScanComplete }: TextScannerProps) {
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!text.trim()) return;

    setIsScanning(true);
    
    try {
      const result = await scanText(text);
      onScanComplete(result, text);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste suspicious email content, text message, or any message you want to analyze..."
        className="min-h-[200px] scan-input resize-none"
      />
      <Button
        onClick={handleScan}
        disabled={!text.trim() || isScanning}
        className="w-full cyber-button"
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Scan Message
          </>
        )}
      </Button>
    </div>
  );
}
