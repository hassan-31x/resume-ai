"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, FileText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplatePreviewProps {
  latexCode: string;
  isLoading?: boolean;
  onLoaded?: () => void;
}

export function TemplatePreview({ latexCode, isLoading = false, onLoaded }: TemplatePreviewProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("structure");
  const [error, setError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<any>(null);
  const [compiledPdf, setCompiledPdf] = useState<string | null>(null);
  const katexContainerRef = useRef<HTMLDivElement>(null);
  const swiftLatexRef = useRef<any>(null);
  
  // Handle external loading state
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);

  useEffect(() => {
    // Load KaTeX script if not already loaded
    if (!document.getElementById('katex-script')) {
      const katexScript = document.createElement('script');
      katexScript.id = 'katex-script';
      katexScript.defer = true;
      katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js";
      katexScript.integrity = "sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6";
      katexScript.crossOrigin = "anonymous";
      document.head.appendChild(katexScript);
      
      const katexCss = document.createElement('link');
      katexCss.rel = 'stylesheet';
      katexCss.href = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css";
      katexCss.integrity = "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP";
      katexCss.crossOrigin = "anonymous";
      document.head.appendChild(katexCss);
      
      const autoRenderScript = document.createElement('script');
      autoRenderScript.defer = true;
      autoRenderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js";
      autoRenderScript.integrity = "sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh";
      autoRenderScript.crossOrigin = "anonymous";
      document.head.appendChild(autoRenderScript);
    }
    
    // Load SwiftLaTeX script if not already loaded
    if (!document.getElementById('swiftlatex-script') && activeTab === "swiftlatex") {
      const swiftLatexScript = document.createElement('script');
      swiftLatexScript.id = 'swiftlatex-script';
      swiftLatexScript.src = "https://unpkg.com/swiftlatex@1.2.0/swiftlatex.js";
      document.head.appendChild(swiftLatexScript);
    }
  }, [activeTab]);

  const parseLatexDocument = (latex: string) => {
    const sections: any[] = [];
    let title = "Untitled Document";
    let author = "";
    
    // Try to extract document title if it exists
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

  const renderStructurePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Basic LaTeX parsing for document structure preview
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
  };

  const renderWithKaTeX = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait for KaTeX to be available
      if (typeof window !== 'undefined' && !window.katex) {
        await new Promise((resolve) => {
          const checkKatex = setInterval(() => {
            if (window.katex) {
              clearInterval(checkKatex);
              resolve(true);
            }
          }, 100);
        });
      }

      if (katexContainerRef.current) {
        // Extract math expressions from LaTeX
        const mathContent = extractMathFromLatex(latexCode);
        
        // Clear previous content
        katexContainerRef.current.innerHTML = '';
        
        // Create a container for the rendered content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'katex-preview p-4';
        
        // Create a formatted document from the LaTeX content
        const formattedHtml = formatLatexForKatex(latexCode);
        contentDiv.innerHTML = formattedHtml;
        
        // Append content to container
        katexContainerRef.current.appendChild(contentDiv);
        
        // Render math expressions with KaTeX
        if (window.renderMathInElement) {
          window.renderMathInElement(katexContainerRef.current, {
            delimiters: [
              {left: "$$", right: "$$", display: true},
              {left: "$", right: "$", display: false},
              {left: "\\(", right: "\\)", display: false},
              {left: "\\[", right: "\\]", display: true}
            ]
          });
        }
      }
      
      setLoading(false);
      if (onLoaded) onLoaded();
    } catch (err) {
      console.error("Error rendering with KaTeX:", err);
      setError("Failed to render LaTeX with KaTeX. KaTeX only supports math expressions, not full LaTeX documents.");
      setLoading(false);
      if (onLoaded) onLoaded();
    }
  };

  const renderWithSwiftLaTeX = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait for SwiftLaTeX to be available
      if (typeof window !== 'undefined' && !window.SwiftLaTeX) {
        await new Promise((resolve) => {
          const checkSwiftLatex = setInterval(() => {
            if (window.SwiftLaTeX) {
              clearInterval(checkSwiftLatex);
              resolve(true);
            }
          }, 100);
        });
      }

      // Only proceed if SwiftLaTeX is available
      if (window.SwiftLaTeX) {
        if (!swiftLatexRef.current) {
          swiftLatexRef.current = new window.SwiftLaTeX.createEngine();
          await swiftLatexRef.current.loadEngine();
        }
        
        // Write the LaTeX file to memory
        swiftLatexRef.current.writeMemFSFile("main.tex", latexCode);
        
        // Set the main file and compile
        swiftLatexRef.current.setEngineMainFile("main.tex");
        const result = await swiftLatexRef.current.compileLaTeX();
        
        if (result.pdf) {
          // Convert the PDF buffer to a URL for display
          const pdfBlob = new Blob([result.pdf], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setCompiledPdf(pdfUrl);
        } else {
          throw new Error("Compilation failed: " + result.log);
        }
      } else {
        throw new Error("SwiftLaTeX not available");
      }
      
      setLoading(false);
      if (onLoaded) onLoaded();
    } catch (err) {
      console.error("Error rendering with SwiftLaTeX:", err);
      setError(`Failed to render LaTeX with SwiftLaTeX: ${err.message}`);
      setLoading(false);
      if (onLoaded) onLoaded();
    }
  };

  const renderServerSide = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call server-side API to compile LaTeX
      const response = await fetch('/api/compile-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latexCode }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
      
      // Get PDF as blob from response
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setCompiledPdf(pdfUrl);
      
      setLoading(false);
      if (onLoaded) onLoaded();
    } catch (err) {
      console.error("Error rendering server-side:", err);
      setError(`Server-side rendering failed: ${err.message}`);
      setLoading(false);
      if (onLoaded) onLoaded();
    }
  };

  // Utility function to extract math expressions from LaTeX
  const extractMathFromLatex = (latex: string) => {
    // Extract inline math $...$ and display math $$...$$
    const mathExpressions: string[] = [];
    
    // Get content inside document environment
    const documentMatch = latex.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    if (documentMatch) {
      const documentContent = documentMatch[1];
      
      // Extract inline math
      const inlineMathRegex = /\$([^\$]+)\$/g;
      let match;
      while ((match = inlineMathRegex.exec(documentContent)) !== null) {
        mathExpressions.push(match[1]);
      }
      
      // Extract display math
      const displayMathRegex = /\$\$([^\$]+)\$\$/g;
      while ((match = displayMathRegex.exec(documentContent)) !== null) {
        mathExpressions.push(match[1]);
      }
    }
    
    return mathExpressions;
  };

  // Utility function to format LaTeX content for KaTeX
  const formatLatexForKatex = (latex: string) => {
    // Get content inside document environment
    const documentMatch = latex.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    if (!documentMatch) return "<p>No document content found</p>";
    
    let content = documentMatch[1];
    
    // Replace sections with HTML headings
    content = content.replace(/\\section{([^}]+)}/g, '<h2 class="text-lg font-semibold border-b pb-1 my-3">$1</h2>');
    content = content.replace(/\\subsection{([^}]+)}/g, '<h3 class="text-md font-semibold my-2">$1</h3>');
    
    // Replace itemize/enumerate with HTML lists
    content = content.replace(/\\begin{itemize}([\s\S]*?)\\end{itemize}/g, '<ul class="list-disc pl-5 my-2">$1</ul>');
    content = content.replace(/\\begin{enumerate}([\s\S]*?)\\end{enumerate}/g, '<ol class="list-decimal pl-5 my-2">$1</ol>');
    content = content.replace(/\\item\s(.*?)(?=\\item|\\end{|$)/g, '<li>$1</li>');
    
    // Replace textbf, textit, underline with HTML equivalents
    content = content.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    content = content.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    content = content.replace(/\\underline{([^}]+)}/g, '<u>$1</u>');
    
    // Replace LaTeX newline commands
    content = content.replace(/\\\\/g, '<br>');
    
    // Handle center environment
    content = content.replace(/\\begin{center}([\s\S]*?)\\end{center}/g, '<div class="text-center">$1</div>');
    
    // Extract document title
    const titleMatch = latex.match(/\\begin{center}[\s\S]*?\\textbf{\\Huge[\s\S]*?\\scshape\s+([^}]+)}/);
    let title = '';
    if (titleMatch) {
      title = `<h1 class="text-2xl font-bold text-center mb-6">${titleMatch[1]}</h1>`;
      // Remove the title from the content to avoid duplication
      content = content.replace(titleMatch[0], '');
    }
    
    return title + content;
  };

  const handleCompile = () => {
    if (activeTab === "structure") {
      renderStructurePreview();
    } else if (activeTab === "katex") {
      renderWithKaTeX();
    } else if (activeTab === "swiftlatex") {
      renderWithSwiftLaTeX();
    } else if (activeTab === "server") {
      renderServerSide();
    }
  };

  // Render appropriate content based on tab
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              {activeTab === "structure" 
                ? "Parsing document structure..." 
                : activeTab === "katex" 
                  ? "Rendering with KaTeX..." 
                  : activeTab === "swiftlatex"
                    ? "Compiling with SwiftLaTeX..." 
                    : "Compiling on server..."}
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4 max-w-md">
            <p className="text-destructive mb-2">Error rendering LaTeX</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    if (activeTab === "structure" && parsedContent) {
      return (
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
            <p>This is a simplified preview showing document structure only.</p>
          </div>
        </div>
      );
    }

    if (activeTab === "katex") {
      return (
        <div ref={katexContainerRef} className="katex-container overflow-auto">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Click "Compile" to render with KaTeX</p>
          </div>
        </div>
      );
    }

    if ((activeTab === "swiftlatex" || activeTab === "server") && compiledPdf) {
      return (
        <iframe 
          src={compiledPdf} 
          className="w-full h-full min-h-[600px] rounded border"
          title="PDF Preview"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-40">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {activeTab === "swiftlatex" 
            ? "Click 'Compile' to render with SwiftLaTeX" 
            : activeTab === "server" 
              ? "Click 'Compile' to render on server" 
              : "Select a rendering method and click 'Compile'"}
        </p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="katex">KaTeX</TabsTrigger>
            <TabsTrigger value="swiftlatex">SwiftLaTeX</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          onClick={handleCompile} 
          className="ml-4"
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Compile
        </Button>
      </div>
      
      <div className="bg-white rounded-md flex-grow overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
} 