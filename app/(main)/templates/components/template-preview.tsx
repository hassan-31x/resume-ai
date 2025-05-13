"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TemplatePreviewProps {
  latexCode: string;
  isLoading?: boolean;
  onLoaded?: () => void;
}

export function TemplatePreview({ latexCode, isLoading = false, onLoaded }: TemplatePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<any>(null);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Parse and render the LaTeX code
    setLoading(true);
    setError(null);

    try {
      // Basic LaTeX parsing for preview purposes
      const parsedLatex = parseLatexDocument(latexCode);
      setParsedContent(parsedLatex);
      setLoading(false);
      if (onLoaded) onLoaded();
    } catch (err) {
      console.error("Error parsing LaTeX:", err);
      setError("Failed to parse LaTeX document. Please check your syntax.");
      setLoading(false);
      if (onLoaded) onLoaded();
    }
  }, [latexCode, onLoaded]);

  // Basic LaTeX parser that extracts document structure
  const parseLatexDocument = (latex: string) => {
    const sections: any[] = [];
    let title = "Untitled Document";
    let author = "";
    
    // Try to extract document title if it exists (modified to not use 's' flag)
    const titleMatch = latex.match(/\\begin{center}[\s\S]*?\\textbf{\\Huge[\s\S]*?\\scshape\s+([^}]+)}|\\title{([^}]+)}/);
    if (titleMatch) {
      title = titleMatch[1] || titleMatch[2] || title;
    }
    
    // Try to extract author
    const authorMatch = latex.match(/\\author{([^}]+)}/);
    if (authorMatch) {
      author = authorMatch[1];
    }
    
    // Extract sections
    const sectionRegex = /\\section{([^}]+)}/g;
    let match;
    while ((match = sectionRegex.exec(latex)) !== null) {
      sections.push(match[1]);
    }
    
    // Extract some content for preview
    let content = "";
    // Look for paragraph content, itemize environments, etc.
    const contentMatch = latex.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    if (contentMatch) {
      content = contentMatch[1]
        .replace(/\\begin{itemize}[\s\S]*?\\end{itemize}/g, "[List items]")
        .replace(/\\begin{.*?}[\s\S]*?\\end{.*?}/g, "[Content block]")
        .replace(/\\.*?\{.*?\}/g, "")
        .replace(/\\\\/g, "\n")
        .trim();
    }
    
    return { title, author, sections, content };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Rendering LaTeX preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <p className="text-destructive mb-2">Error rendering LaTeX</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 bg-white rounded-md text-black">
      {parsedContent ? (
        <div className="latex-preview max-w-[800px] mx-auto p-8 border shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{parsedContent.title}</h1>
            {parsedContent.author && (
              <p className="text-sm mt-2">{parsedContent.author}</p>
            )}
          </div>
          
          {parsedContent.sections.length > 0 ? (
            <div className="space-y-4">
              {parsedContent.sections.map((section: string, idx: number) => (
                <div key={idx} className="document-section">
                  <h2 className="text-lg font-semibold border-b pb-1">{section}</h2>
                  <div className="content px-2 py-3 bg-gray-50">
                    [Section content for {section}]
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No sections found in LaTeX document</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>This is a simplified preview. In production, a full LaTeX rendering engine would show the exact document.</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No content to preview</p>
        </div>
      )}
    </div>
  );
} 