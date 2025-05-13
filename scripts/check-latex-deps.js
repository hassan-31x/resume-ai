#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}===================================${colors.reset}`);
console.log(`${colors.blue}LaTeX Dependencies Checker${colors.reset}`);
console.log(`${colors.blue}===================================${colors.reset}\n`);

// Check if pdflatex is installed
try {
  console.log(`${colors.cyan}Checking for pdflatex...${colors.reset}`);
  const pdflatexVersion = execSync('pdflatex --version').toString();
  console.log(`${colors.green}✓ pdflatex found:${colors.reset}`);
  
  // Extract version info from the output
  const versionMatch = pdflatexVersion.match(/pdfTeX\s+([0-9\.]+)/);
  if (versionMatch) {
    console.log(`  Version: ${versionMatch[1]}\n`);
  } else {
    console.log(`  ${pdflatexVersion.split('\n')[0]}\n`);
  }
} catch (error) {
  console.log(`${colors.red}✗ pdflatex not found${colors.reset}\n`);
  console.log(`${colors.yellow}Installation instructions:${colors.reset}`);
  
  if (process.platform === 'darwin') { // macOS
    console.log(`  Install MacTeX: https://www.tug.org/mactex/`);
    console.log(`  Alternative (minimal): brew install --cask basictex`);
  } else if (process.platform === 'linux') {
    console.log(`  Ubuntu/Debian: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra`);
    console.log(`  Fedora: sudo dnf install texlive-scheme-basic texlive-latex`);
  } else if (process.platform === 'win32') {
    console.log(`  Install MikTeX: https://miktex.org/download`);
    console.log(`  or TeXLive: https://tug.org/texlive/windows.html`);
  } else {
    console.log(`  Dockerized environment detected. LaTeX should be pre-installed.`);
  }
  
  console.log(`\n${colors.yellow}Without LaTeX, the PDF rendering functionality will not work.${colors.reset}\n`);
  process.exit(1);
}

// Check for required LaTeX packages
console.log(`${colors.cyan}Checking for common LaTeX packages...${colors.reset}`);

// Create a simple LaTeX document to test package availability
const tempDir = path.join(os.tmpdir(), 'latex-check');
fs.mkdirSync(tempDir, { recursive: true });

const testLatexFile = path.join(tempDir, 'test.tex');
const testLatexContent = `
\\documentclass{article}
\\usepackage{latexsym}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{babel}
\\usepackage{tabularx}

\\begin{document}
Test document
\\end{document}
`;

fs.writeFileSync(testLatexFile, testLatexContent);

try {
  execSync(`cd ${tempDir} && pdflatex -interaction=nonstopmode test.tex`);
  console.log(`${colors.green}✓ All required LaTeX packages are available${colors.reset}\n`);
} catch (error) {
  console.log(`${colors.red}✗ Some LaTeX packages may be missing${colors.reset}\n`);
  
  // Parse the log file to find missing packages
  try {
    const logContent = fs.readFileSync(path.join(tempDir, 'test.log'), 'utf8');
    const missingPackages = [];
    
    // Find lines with "LaTeX Error: File ... not found"
    const packageRegex = /LaTeX Error: File [`']([^']+)\.sty[`'] not found/g;
    let match;
    while ((match = packageRegex.exec(logContent)) !== null) {
      missingPackages.push(match[1]);
    }
    
    if (missingPackages.length > 0) {
      console.log(`${colors.yellow}Missing LaTeX packages:${colors.reset} ${missingPackages.join(', ')}\n`);
      
      console.log(`${colors.yellow}Installation instructions:${colors.reset}`);
      if (process.platform === 'darwin') {
        console.log(`  Install full MacTeX or run: sudo tlmgr install ${missingPackages.join(' ')}`);
      } else if (process.platform === 'linux') {
        console.log(`  sudo apt-get install texlive-latex-extra texlive-fonts-recommended`);
      } else if (process.platform === 'win32') {
        console.log(`  These packages should be automatically installed by MikTeX when needed`);
        console.log(`  or install complete TeXLive distribution`);
      }
    } else {
      console.log(`${colors.yellow}Could not determine missing packages.${colors.reset}`);
      console.log(`  Check the log file for details: ${path.join(tempDir, 'test.log')}`);
    }
  } catch (logError) {
    console.log(`${colors.red}Could not read log file to determine missing packages${colors.reset}`);
  }
}

// Clean up
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (error) {
  // Ignore clean-up errors
}

console.log(`${colors.blue}===================================${colors.reset}`);
console.log(`${colors.blue}LaTeX Setup Complete${colors.reset}`);
console.log(`${colors.blue}===================================${colors.reset}\n`);

if (process.platform === 'win32') {
  console.log(`${colors.yellow}Note for Windows users:${colors.reset}`);
  console.log(`  Make sure the LaTeX distribution bin directory is in your PATH environment variable`);
  console.log(`  Restart your application/terminal after installing LaTeX\n`);
}

console.log(`${colors.cyan}For any LaTeX rendering errors, check these common issues:${colors.reset}`);
console.log(`  1. Missing packages (fix with: tlmgr install <package>)`);
console.log(`  2. Special characters in LaTeX code that need escaping`);
console.log(`  3. Incompatible LaTeX commands with pdflatex`);
console.log(`  4. File permissions for temporary directories\n`); 