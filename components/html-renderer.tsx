'use client';

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface HtmlRendererProps {
  html: string;
  css: string;
  className?: string;
  onRender?: () => void;
  onError?: () => void;
}

export default function HtmlRenderer({ html, css, className = "", onRender, onError }: HtmlRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    try {
      if (iframeRef.current) {
        // Set up iframe load handler
        iframeRef.current.onload = () => {
          setIsLoading(false);
          if (onRender) onRender();
        };
        
        // Set iframe content
        const document = iframeRef.current.contentDocument;
        if (document) {
          document.open();
          document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      console.error("Error rendering HTML:", err);
      setError("Failed to render HTML content");
      setIsLoading(false);
      if (onError) onError();
    }
  }, [html, css, onRender, onError]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className={`relative h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Resume Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
} 