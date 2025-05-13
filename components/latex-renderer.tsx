'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface LatexRendererProps {
  latexCode: string;
}

export default function LatexRenderer({ latexCode }: LatexRendererProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const renderLatex = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/render-latex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latexCode }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to render LaTeX');
        }
        
        const data = await response.json();
        setPdfUrl(data.pdfUrl);
      } catch (err) {
        console.error('Error rendering LaTeX:', err);
        setError(err instanceof Error ? err.message : 'Failed to render LaTeX');
      } finally {
        setLoading(false);
      }
    };
    
    if (latexCode) {
      renderLatex();
    }
  }, [latexCode]);
  
  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <div className="flex items-center justify-center h-[600px] border rounded-md bg-muted/50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Rendering LaTeX...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[600px] border rounded-md bg-destructive/10">
          <div className="flex flex-col items-center text-center max-w-md px-4">
            <p className="text-destructive font-semibold mb-2">Error rendering LaTeX</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <pre className="mt-4 text-xs text-left bg-muted p-4 rounded-md w-full overflow-auto">
              {error}
            </pre>
          </div>
        </div>
      ) : pdfUrl ? (
        <div className="flex flex-col">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="w-full h-[800px] border rounded-md"
            title="LaTeX PDF Renderer"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[600px] border rounded-md bg-muted/50">
          <p className="text-muted-foreground">No content to display</p>
        </div>
      )}
    </div>
  );
} 