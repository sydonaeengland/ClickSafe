import { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { scanUrl, type ScanResult } from '@/lib/scanEngine';

interface UrlScannerProps {
  onScanComplete: (result: ScanResult, originalUrl: string) => void;
}

export function UrlScanner({ onScanComplete }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const result = scanUrl(url);
    onScanComplete(result, url);
    setIsScanning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter suspicious URL (e.g., bit.ly/abc123)"
          className="flex-1 scan-input"
        />
        <Button
          onClick={handleScan}
          disabled={!url.trim() || isScanning}
          className="cyber-button shrink-0"
        >
          {isScanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-2" />
              Scan Link
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We'll check for shortened URLs, suspicious domains, impersonation patterns, and more.
      </p>
    </div>
  );
}
