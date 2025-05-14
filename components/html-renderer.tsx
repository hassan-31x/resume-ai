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
                  width: 100%;
                  height: auto;
                  font-size: 55%;
                  aspect-ratio: 1/1.414;
                  box-sizing: border-box;
                  transform-origin: top left;
                  background-color: white;
                  color: #333;
                  line-height: 1.5;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  // font-size: 12px; /* Base font size */
                }
                
                /* Set root font size to scale with body width */
                html {
                  font-size: calc(0.5em + 0.8vw); /* Dynamic base size */
                }
                
                .resume-container {
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  padding: 5%;
                  box-sizing: border-box;
                }
                
                /* Typography scale based on container */
                h1 { font-size: 1.8em; margin-bottom: 0.5em; }
                h2 { font-size: 1.3em; margin-bottom: 0.4em; }
                h3 { font-size: 1.1em; margin-bottom: 0.3em; }
                p { font-size: 1em; margin-bottom: 0.3em; }
                li { font-size: 1em; margin-bottom: 0.3em; }
                
                /* Spacing utilities relative to font size */
                .spacing-sm { margin-bottom: 0.5em; }
                .spacing-md { margin-bottom: 1em; }
                .spacing-lg { margin-bottom: 1.5em; }
                
                /* Set proper scaling for inner elements */
                ul, ol { 
                  margin: 0.6em 0;
                  padding-left: 1.5em;
                }
                
                @media print {
                  body {
                    width: 210mm;
                    height: 297mm;
                    margin: 0;
                    padding: 0;
                    transform: none !important;
                    font-size: 11pt; /* Standard print size */
                  }
                  
                  html {
                    font-size: 11pt; /* Lock font size for print */
                  }
                  
                  .resume-container {
                    padding: 0.5in;
                  }
                  
                  /* Override any transforms for print */
                  * {
                    transform: none !important;
                  }
                }
                ${css}
              </style>
              <script>
                // Scale the content to fit the container
                window.onload = function() {
                  // Get iframe dimensions
                  var containerWidth = window.innerWidth;
                  var containerHeight = window.innerHeight;
                  
                  // Get content dimensions - use width as the primary constraint
                  var contentWidth = document.body.offsetWidth;
                  var contentHeight = document.body.offsetHeight;
                  
                  // Calculate the scale factors for width and height
                  var scaleX = containerWidth / contentWidth;
                  var scaleY = containerHeight / contentHeight;
                  
                  // Use the smaller scale factor to ensure content fits completely
                  var scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add margin
                  
                  // Apply scale transformation
                  document.body.style.transform = 'scale(' + scale + ')';
                  document.body.style.transformOrigin = 'top left';
                  
                  // Adjust font size based on scale
                  if (scale < 0.7) {
                    // For smaller containers, reduce base font size
                    document.documentElement.style.fontSize = 'calc(0.45em + 0.6vw)';
                  } else if (scale > 1.2) {
                    // Prevent fonts from getting too large on big screens
                    document.documentElement.style.fontSize = 'calc(0.45em + 0.4vw)';
                  }
                  
                  // Center the content
                  var scaledWidth = contentWidth * scale;
                  var scaledHeight = contentHeight * scale;
                  
                  // Calculate margins to center the content
                  if (containerWidth > scaledWidth) {
                    var marginLeft = (containerWidth - scaledWidth) / 2;
                    document.body.style.marginLeft = marginLeft / scale + 'px';
                  }
                  
                  if (containerHeight > scaledHeight) {
                    var marginTop = (containerHeight - scaledHeight) / 2;
                    document.body.style.marginTop = marginTop / scale + 'px';
                  }
                };
                
                // Re-scale on window resize
                window.onresize = function() {
                  window.onload();
                };
              </script>
            </head>
            <body>
              <div class="resume-container">
                ${html}
              </div>
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