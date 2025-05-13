import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Common replacements to fix LaTeX code that might cause issues
const preprocessLatexCode = (code: string) => {
  // Replace or remove problematic statements
  let processedCode = code;
  
  // Handle glyphtounicode which is often missing
  if (processedCode.includes('\\input{glyphtounicode}')) {
    processedCode = processedCode.replace('\\input{glyphtounicode}', '% \\input{glyphtounicode} - Commented out for compatibility');
    
    // If using the PDF accessible feature, we need to add alternatives
    if (processedCode.includes('\\pdfgentounicode=1')) {
      processedCode = processedCode.replace('\\pdfgentounicode=1', '% \\pdfgentounicode=1 - Commented out for compatibility');
    }
  }
  
  // Handle other common issues
  // Example: Check for missing packages
  const requiredPackages = [
    'titlesec',
    'marvosym',
    'enumitem',
    'hyperref',
    'fancyhdr',
    'babel',
    'tabularx'
  ];
  
  // Add a warning comment for potentially missing packages
  processedCode = '% Note: Some packages may be missing in your LaTeX installation.\n% This rendering attempt tries to work around common issues.\n\n' + processedCode;
  
  return processedCode;
};

export async function POST(req: NextRequest) {
  try {
    const { latexCode } = await req.json();
    
    if (!latexCode) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      );
    }
    
    // Preprocess LaTeX code to fix common issues
    const processedLatexCode = preprocessLatexCode(latexCode);
    
    // Create a unique temp directory
    const tempDir = path.join(os.tmpdir(), `latex-${uuidv4()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Write LaTeX code to a file
    const texFilePath = path.join(tempDir, 'resume.tex');
    fs.writeFileSync(texFilePath, processedLatexCode);
    
    // Compile LaTeX to PDF
    try {
      // First try with pdflatex
      await execAsync(`cd ${tempDir} && pdflatex -interaction=nonstopmode resume.tex`);
    } catch (error) {
      // Attempt a second compilation to resolve references
      try {
        await execAsync(`cd ${tempDir} && pdflatex -interaction=nonstopmode resume.tex`);
      } catch (secondError) {
        // Check if PDF was still generated despite errors
        const pdfFilePath = path.join(tempDir, 'resume.pdf');
        if (!fs.existsSync(pdfFilePath)) {
          console.error('LaTeX compilation error:', error);
          
          // Get the log file content to provide more detailed error information
          const logFilePath = path.join(tempDir, 'resume.log');
          let logContent = 'No log file available';
          let errorMessage = 'Failed to compile LaTeX';
          
          if (fs.existsSync(logFilePath)) {
            logContent = fs.readFileSync(logFilePath, 'utf-8');
            
            // Extract useful error information from the log
            // First check for missing files
            const missingFileMatch = logContent.match(/I can't find file `([^']+)'/);
            if (missingFileMatch) {
              errorMessage = `Missing file: ${missingFileMatch[1]}`;
            } else {
              // Check for LaTeX errors
              const errorMatch = logContent.match(/!(.*?)$/m);
              if (errorMatch) {
                errorMessage = `LaTeX Error: ${errorMatch[1].trim()}`;
              }
            }
          }
          
          return NextResponse.json(
            { error: errorMessage, log: logContent },
            { status: 400 }
          );
        }
      }
    }
    
    // Use public directory to serve the PDF
    const publicDir = path.join(process.cwd(), 'public');
    const pdfDir = path.join(publicDir, 'latex-pdf');
    
    // Create directory if it doesn't exist
    fs.mkdirSync(pdfDir, { recursive: true });
    
    // Generate a unique filename
    const uniqueFilename = `resume-${uuidv4()}.pdf`;
    const publicPdfPath = path.join(pdfDir, uniqueFilename);
    
    // Copy the generated PDF to the public directory
    fs.copyFileSync(
      path.join(tempDir, 'resume.pdf'),
      publicPdfPath
    );
    
    // Clean up temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up temp directory:', error);
    }
    
    // Return the URL to the PDF
    return NextResponse.json({
      pdfUrl: `/latex-pdf/${uniqueFilename}`
    });
    
  } catch (error) {
    console.error('Error processing LaTeX:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 