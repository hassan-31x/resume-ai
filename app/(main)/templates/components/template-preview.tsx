"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

interface TemplatePreviewProps {
  html: string;
  css: string;
  isLoading?: boolean;
  onLoaded?: () => void;
}

export function TemplatePreview({ html, css, isLoading = false, onLoaded }: TemplatePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);

  useEffect(() => {
    try {
      if (iframeRef.current) {
        // Wait for iframe to load
        iframeRef.current.onload = () => {
          setLoading(false);
          if (onLoaded) onLoaded();
        };
        
        // Set content in iframe
        const document = iframeRef.current.contentDocument;
        if (document) {
          document.open();
          document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                }
                ${css}
              </style>
            </head>
            <body>
              ${html}
            </body>
            </html>
          `);
          document.close();
        }
      }
    } catch (err) {
      console.error("Error rendering template:", err);
      setError("Failed to render HTML template. Please check your code.");
      setLoading(false);
      if (onLoaded) onLoaded();
    }
  }, [html, css, onLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Rendering preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <p className="text-destructive mb-2">Error rendering template</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-white">
      <iframe 
        ref={iframeRef}
        className="w-full h-full border-none"
        title="Resume Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
} 