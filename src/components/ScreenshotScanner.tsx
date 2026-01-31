import { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';

interface ScreenshotScannerProps {
  onTextExtracted: (text: string, imageBase64?: string) => void;
}

export function ScreenshotScanner({ onTextExtracted }: ScreenshotScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lowConfidence, setLowConfidence] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setLowConfidence(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text.trim();
      const confidence = result.data.confidence;

      setExtractedText(text);
      setLowConfidence(confidence < 70);
      setIsProcessing(false);
    } catch (error) {
      console.error('OCR Error:', error);
      setIsProcessing(false);
      setExtractedText('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      processImage(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleScanExtracted = () => {
    if (extractedText.trim()) {
      onTextExtracted(extractedText, imagePreview || undefined);
    }
  };

  const handleReset = () => {
    setExtractedText('');
    setImagePreview(null);
    setLowConfidence(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!imagePreview && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-1">
            Drop your screenshot here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PNG and JPG images
          </p>
        </div>
      )}

      {/* Processing State */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="cyber-card text-center py-8"
          >
            <Loader2 className="h-10 w-10 mx-auto mb-4 text-primary animate-spin" />
            <p className="font-medium text-foreground mb-2">Extracting text from image...</p>
            <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {imagePreview && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={imagePreview}
              alt="Uploaded screenshot"
              className="w-full max-h-48 object-contain bg-muted"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 px-3 py-1 text-xs font-medium bg-background/90 backdrop-blur rounded-lg border border-border hover:bg-background"
            >
              Change Image
            </button>
          </div>

          {/* Low Confidence Warning */}
          {lowConfidence && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-risk-medium-bg border border-risk-medium/30">
              <AlertCircle className="h-5 w-5 text-risk-medium shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Low OCR Confidence</p>
                <p className="text-sm text-muted-foreground">
                  The text extraction may not be accurate. Please review and edit the extracted text before scanning.
                </p>
              </div>
            </div>
          )}

          {/* Extracted Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Extracted Text {extractedText ? '' : '(No text found)'}
            </label>
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="No text was extracted from the image. Try a clearer screenshot."
              className="min-h-[120px] scan-input"
            />
          </div>

          {/* Scan Button */}
          <Button
            onClick={handleScanExtracted}
            disabled={!extractedText.trim()}
            className="w-full cyber-button"
          >
            <Upload className="h-4 w-4 mr-2" />
            Scan Extracted Text
          </Button>
        </motion.div>
      )}
    </div>
  );
}
