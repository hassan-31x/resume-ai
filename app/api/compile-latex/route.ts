import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// This function will compile LaTeX to PDF using puppeteer and KaTeX
export async function POST(req: NextRequest) {
  try {
    // Get LaTeX code from the request
    const { latexCode } = await req.json();
    
    if (!latexCode) {
      return NextResponse.json(
        { error: 'No LaTeX code provided' },
        { status: 400 }
      );
    }

    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Create an HTML template with KaTeX for rendering
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>LaTeX Preview</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css">
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"></script>
          <style>
            body {
              font-family: 'Computer Modern', serif;
              margin: 0;
              padding: 20px;
              font-size: 12pt;
              line-height: 1.5;
              color: #000;
              background: #fff;
            }
            .latex-content {
              width: 21cm;
              min-height: 29.7cm;
              padding: 2cm;
              margin: 0 auto;
              background: #fff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h2, h3 { margin-top: 1em; }
            h1 { font-size: 1.5em; }
            h2 { font-size: 1.3em; }
            h3 { font-size: 1.1em; }
            .section { margin-bottom: 1em; }
            .center { text-align: center; }
            @media print {
              body { background: none; }
              .latex-content {
                width: 100%;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="latex-content" id="content"></div>
          
          <script>
            // Format LaTeX document
            function formatLatexForWeb(latex) {
              // Extract content inside document environment
              const documentMatch = latex.match(/\\\\begin{document}([\\s\\S]*?)\\\\end{document}/);
              if (!documentMatch) return "<p>No document content found</p>";
              
              let content = documentMatch[1];
              
              // Replace sections with HTML elements
              content = content.replace(/\\\\section{([^}]+)}/g, '<h2 class="section">$1</h2>');
              content = content.replace(/\\\\subsection{([^}]+)}/g, '<h3>$1</h3>');
              
              // Replace itemize/enumerate with HTML lists
              content = content.replace(/\\\\begin{itemize}([\\s\\S]*?)\\\\end{itemize}/g, '<ul>$1</ul>');
              content = content.replace(/\\\\begin{enumerate}([\\s\\S]*?)\\\\end{enumerate}/g, '<ol>$1</ol>');
              content = content.replace(/\\\\item\\s(.*?)(?=\\\\item|\\\\end{|$)/g, '<li>$1</li>');
              
              // Format text styling
              content = content.replace(/\\\\textbf{([^}]+)}/g, '<strong>$1</strong>');
              content = content.replace(/\\\\textit{([^}]+)}/g, '<em>$1</em>');
              content = content.replace(/\\\\underline{([^}]+)}/g, '<u>$1</u>');
              
              // Handle newlines and paragraphs
              content = content.replace(/\\\\\\\\/g, '<br>');
              content = content.replace(/\\n\\n/g, '</p><p>');
              
              // Handle center environment
              content = content.replace(/\\\\begin{center}([\\s\\S]*?)\\\\end{center}/g, '<div class="center">$1</div>');
              
              return content;
            }
            
            // Get LaTeX content and format it
            const latexCode = ${JSON.stringify(latexCode)};
            const formattedContent = formatLatexForWeb(latexCode);
            
            // Insert the formatted content
            document.getElementById('content').innerHTML = formattedContent;
            
            // Render math expressions with KaTeX
            renderMathInElement(document.body, {
              delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\\\(", right: "\\\\)", display: false},
                {left: "\\\\[", right: "\\\\]", display: true}
              ],
              throwOnError: false
            });
          </script>
        </body>
        </html>
      `;
      
      // Set the HTML content
      await page.setContent(htmlContent);
      
      // Wait for KaTeX to render
      await page.waitForFunction(() => {
        const katexElements = document.querySelectorAll('.katex, .katex-display');
        const contentElement = document.querySelector('#content');
        return katexElements.length > 0 || (contentElement && contentElement.textContent && contentElement.textContent.includes('No document content found'));
      }, { timeout: 5000 }).catch(() => {
        // Continue if timeout - maybe there's no math to render
        console.log('No KaTeX elements found or timeout');
      });
      
      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });
      
      // Close the browser
      await browser.close();
      
      // Return the PDF
      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="latex_preview.pdf"'
        }
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error compiling LaTeX:', error);
    return NextResponse.json(
      { error: 'Failed to compile LaTeX: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 