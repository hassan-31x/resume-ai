"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Separate HTML and CSS content
const defaultHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Resume</title>
</head>
<body>
  <div class="resume">
    <div class="header">
      <h1>John Developer</h1>
      <h2>Full Stack Software Engineer</h2>
      <div class="contact-info">
        <span>📧 john@email.com</span>
        <span>📱 (123) 456-7890</span>
        <span>📍 San Francisco</span>
        <span>🔗 linkedin.com/in/jd</span>
        <span>🐙 github.com/jdev</span>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Summary</h3>
      <p>Full Stack Developer with 5+ years experience in web applications. Expert in JavaScript, React, Node.js, and cloud technologies.</p>
    </div>

    <div class="section">
      <h3 class="section-title">Experience</h3>
      
      <div class="job">
        <div class="job-title">
          Senior Software Engineer <span class="job-company">at TechCorp</span>
          <span class="job-date">2021 - Present</span>
        </div>
        <div class="job-description">
          <ul>
            <li>Built real-time collaboration platform improving team productivity by 35%</li>
            <li>Implemented microservices reducing deployment time by 40%</li>
            <li>Mentored junior developers and maintained code quality</li>
          </ul>
        </div>
      </div>

      <div class="job">
        <div class="job-title">
          Software Developer <span class="job-company">at InnovateSoft</span>
          <span class="job-date">2018 - 2020</span>
        </div>
        <div class="job-description">
          <ul>
            <li>Created responsive web apps improving user engagement by 25%</li>
            <li>Developed RESTful APIs and integrated third-party services</li>
            <li>Increased test coverage to 85% with Jest and Cypress</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Education</h3>
      <div class="education">
        <div class="job-title">
          <span class="education-school">University of Technology</span>
          <span class="education-date">2014 - 2018</span>
        </div>
        <div class="education-description">
          BS in Computer Science, GPA: 3.8
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Skills</h3>
      <ul class="skills">
        <li>JavaScript</li>
        <li>React</li>
        <li>Node.js</li>
        <li>TypeScript</li>
        <li>Express</li>
        <li>MongoDB</li>
        <li>SQL</li>
        <li>AWS</li>
        <li>Docker</li>
        <li>CI/CD</li>
        <li>Jest</li>
        <li>Git</li>
      </ul>
    </div>

    <div class="section">
      <h3 class="section-title">Projects</h3>
      
      <div class="projects">
        <div class="project-title">
          E-commerce Platform
        </div>
        <div class="project-description">
          Next.js redesign improving load speeds by 60% and conversion by 15%.
        </div>
      </div>
      
      <div class="projects">
        <div class="project-title">
          Chat Application
        </div>
        <div class="project-description">
          Socket.io and Redis system supporting 10,000+ concurrent users.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

const defaultCSS = `body {
  font-family: 'Arial', sans-serif;
  line-height: 1.3;
  color: #333;
  margin: 0;
  padding: 0;
  font-size: 80%; /* Further reduced base font size */
}
.resume {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.header {
  text-align: center;
  margin-bottom: 2.5%;
  border-bottom: 0.1em solid #2c3e50;
  padding-bottom: 1.2%;
}
.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.6em;
  line-height: 1;
}
.header h2 {
  margin: 0.3em 0;
  font-weight: normal;
  color: #7f8c8d;
  font-size: 1em;
}
.contact-info {
  margin: 1% 0;
  font-size: 0.75em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.contact-info span {
  margin: 0 1%;
  white-space: nowrap;
  display: inline-block;
  padding: 0.1em 0;
}
.section {
  margin-bottom: 2.5%;
  position: relative;
}
.section-title {
  color: #2c3e50;
  border-bottom: 0.05em solid #eee;
  padding-bottom: 0.3%;
  margin-bottom: 1%;
  font-size: 1em;
  text-transform: uppercase;
}
.job {
  margin-bottom: 1.5%;
}
.job-title {
  font-weight: bold;
  margin-bottom: 0.3%;
  font-size: 0.85em;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.job-company, .education-school {
  font-weight: bold;
  color: #3498db;
}
.job-date, .education-date {
  color: #7f8c8d;
  font-style: italic;
  font-size: 0.75em;
}
.job-description, .education-description {
  margin-top: 0.3%;
  font-size: 0.8em;
}
.job-description ul, .education-description ul {
  margin: 0.2em 0;
  padding-left: 1em;
}
.job-description li, .education-description li {
  margin-bottom: 0.2em;
}
ul.skills {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}
ul.skills li {
  background-color: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 0.1em;
  font-size: 0.7em;
  margin: 0.15em;
  display: inline-block;
}
.projects {
  margin-bottom: 1.5%;
}
.project-title {
  font-weight: bold;
  margin-bottom: 0.3%;
  font-size: 0.85em;
}
.project-description {
  font-size: 0.8em;
}
@media print {
  body {
    font-size: 8pt;
  }
  ul.skills li {
    page-break-inside: avoid;
  }
  .job, .section {
    page-break-inside: avoid;
  }
}`;

// Combine HTML and CSS for rendering
const combineHTMLAndCSS = (html: string, css: string) => {
  // Check if HTML has a head tag
  if (html.includes('<head>')) {
    return html.replace('</head>', `<style>${css}</style></head>`);
  } else {
    // If no head tag, add one with the styles
    return html.replace('<html>', `<html><head><style>${css}</style></head>`);
  }
};

const HtmlResume = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [htmlCode, setHtmlCode] = useState(defaultHTML);
  const [cssCode, setCssCode] = useState(defaultCSS);
  const [combinedCode, setCombinedCode] = useState('');
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Combine HTML and CSS whenever they change
  useEffect(() => {
    const combined = combineHTMLAndCSS(htmlCode, cssCode);
    setCombinedCode(combined);
  }, [htmlCode, cssCode]);

  // Handle HTML code change
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlCode(e.target.value);
  };

  // Handle CSS code change
  const handleCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCssCode(e.target.value);
  };

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      alert('Cannot generate PDF: Resume element not found');
      return;
    }
    
    try {
      setIsGeneratingPDF(true);
      
      // Import html2pdf dynamically
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      const element = resumeRef.current;
      
      const opt = {
        margin: [0, 0, 0, 0],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const // Type assertion with const for better type safety
        }
      };

      // Execute html2pdf with options
      await html2pdf().set(opt).from(element).save();
      
      // Success notification
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again later.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <h1 className="text-2xl font-bold p-4 bg-gray-100 dark:bg-gray-800">HTML Resume Renderer</h1>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700 h-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'html' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('html')}
            >
              HTML
            </button>
            <button 
              className={`py-2 px-4 font-medium ${activeTab === 'css' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('css')}
            >
              CSS
            </button>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 overflow-auto p-4">
            <div className="rounded-lg overflow-hidden h-full relative">
              {activeTab === 'html' ? (
                <textarea
                  value={htmlCode}
                  onChange={handleHtmlChange}
                  className="w-full h-full p-4 bg-[#1E1E1E] text-white font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                  placeholder="Enter your HTML code here..."
                />
              ) : (
                <textarea
                  value={cssCode}
                  onChange={handleCssChange}
                  className="w-full h-full p-4 bg-[#1E1E1E] text-white font-mono text-sm focus:outline-none resize-none"
                  spellCheck="false"
                  placeholder="Enter your CSS code here..."
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Right Panel - Rendered Resume */}
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resume Preview (A4)</h2>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`px-4 py-2 ${isGeneratingPDF ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors`}
            >
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="resume-container" style={{ 
              width: '100%',
              maxWidth: '450px',
              maxHeight: '100%',
              aspectRatio: '1/1.414', /* A4 ratio (210mm/297mm) */
              position: 'relative',
              margin: '0 auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              background: 'white',
              overflow: 'hidden'
            }}>
              <div 
                ref={resumeRef}
                className="a4-container bg-white" 
                style={{ 
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '5%',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: combinedCode }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlResume;
