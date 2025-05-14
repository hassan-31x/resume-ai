'use client';

import { useState } from 'react';
import HtmlRenderer from '@/components/html-renderer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, Eye, Code, RefreshCw } from 'lucide-react';
import Editor from "@monaco-editor/react";

export default function ResumeRendererPage() {
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState<string>(`<div class="resume">
  <header class="header">
    <h1>John Doe</h1>
    <p class="contact-info">
      123 Main Street, City, State 12345 | (123) 456-7890 | john.doe@email.com | linkedin.com/in/johndoe
    </p>
  </header>
  
  <section class="resume-section">
    <h2>Education</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>University of Example</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Bachelor of Science in Computer Science</p>
        <span class="date">Aug 2018 - May 2022</span>
      </div>
      <p>GPA: 3.85/4.0</p>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Experience</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Software Engineer</h3>
        <span class="location">Tech Company Inc., City, State</span>
      </div>
      <div class="item-subheader">
        <p></p>
        <span class="date">Jun 2022 - Present</span>
      </div>
      <ul>
        <li>Developed and maintained web applications using React, Node.js, and MongoDB</li>
        <li>Collaborated with cross-functional teams to design and implement new features</li>
        <li>Improved application performance by 30% through code optimization</li>
      </ul>
    </div>
    
    <div class="resume-item">
      <div class="item-header">
        <h3>Software Engineering Intern</h3>
        <span class="location">Startup XYZ, City, State</span>
      </div>
      <div class="item-subheader">
        <p></p>
        <span class="date">May 2021 - Aug 2021</span>
      </div>
      <ul>
        <li>Assisted in developing RESTful APIs using Express.js and MongoDB</li>
        <li>Implemented responsive UI components using React and Material-UI</li>
        <li>Participated in daily stand-ups and biweekly sprint planning meetings</li>
      </ul>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Skills</h2>
    <div class="skills-grid">
      <div class="skill-category">
        <h3>Programming Languages:</h3>
        <p>JavaScript, TypeScript, Python, Java, C++</p>
      </div>
      <div class="skill-category">
        <h3>Frontend:</h3>
        <p>React, HTML, CSS, Tailwind CSS, Material-UI</p>
      </div>
      <div class="skill-category">
        <h3>Backend:</h3>
        <p>Node.js, Express.js, Django, Spring Boot</p>
      </div>
      <div class="skill-category">
        <h3>Databases:</h3>
        <p>MongoDB, PostgreSQL, MySQL</p>
      </div>
      <div class="skill-category">
        <h3>Tools:</h3>
        <p>Git, Docker, AWS, Firebase, Jira</p>
      </div>
    </div>
  </section>
</div>`);

  const [cssStyles, setCssStyles] = useState<string>(`.resume {
  max-width: 100%;
  margin: 0 auto;
  padding: 5%;
  font-family: 'Inter', sans-serif;
  font-size: 1em;
  line-height: 1.5;
  color: #333;
  background-color: white;
}

.header {
  text-align: center;
  margin-bottom: 1.5em;
}

.header h1 {
  margin: 0;
  font-size: 1.8em;
  color: #4A6CF7;
}

.contact-info {
  margin-top: 0.4em;
  font-size: 0.85em;
}

.resume-section {
  margin-bottom: 1.5em;
}

.resume-section h2 {
  font-size: 1.2em;
  text-transform: uppercase;
  border-bottom: 1px solid #4A6CF7;
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
  color: #4A6CF7;
}

.resume-item {
  margin-bottom: 0.75em;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.item-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin: 0.3em 0;
}

.item-subheader p {
  margin: 0;
}

.location {
  color: #6E82A6;
  font-size: 0.9em;
}

.date {
  color: #6E82A6;
  font-size: 0.9em;
}

ul {
  margin: 0.6em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.3em;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
}

.skill-category h3 {
  font-size: 0.95em;
  margin: 0;
  display: inline;
}

.skill-category p {
  display: inline;
  margin-left: 0.3em;
}
`);

  const [isRendering, setIsRendering] = useState(false);
  const [key, setKey] = useState<number>(0);

  const handleRender = () => {
    setIsRendering(true);
    setKey(prev => prev + 1); // Force re-render
    setTimeout(() => setIsRendering(false), 500);
    toast({
      title: "Preview updated",
      description: "The resume preview has been refreshed with your changes.",
    });
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML downloaded",
      description: "Your HTML content has been downloaded successfully.",
    });
  };

  const handleDownloadCSS = () => {
    const blob = new Blob([cssStyles], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSS downloaded",
      description: "Your CSS styles have been downloaded successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Resume HTML/CSS Editor</h1>
        <div className="flex gap-2">
          <Button onClick={handleRender} disabled={isRendering}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Preview
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="html">
            <div className="flex items-center justify-between mb-2">
              <TabsList>
                <TabsTrigger value="html" className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  CSS
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
                  <FileDown className="h-4 w-4 mr-1" /> HTML
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSS}>
                  <FileDown className="h-4 w-4 mr-1" /> CSS
                </Button>
              </div>
            </div>
            
            <TabsContent value="html">
              <Card>
                <CardContent className="p-0 h-[calc(100vh-250px)]">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    value={htmlContent}
                    onChange={(value) => setHtmlContent(value || "")}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: "on",
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                    theme="vs-dark"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="css">
        <Card>
                <CardContent className="p-0 h-[calc(100vh-250px)]">
                  <Editor
                    height="100%"
                    defaultLanguage="css"
                    value={cssStyles}
                    onChange={(value) => setCssStyles(value || "")}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: "on",
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                    theme="vs-dark"
                  />
          </CardContent>
        </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="h-[calc(100vh-250px)] overflow-auto border rounded-md bg-white flex justify-center items-center p-4">
              <div 
                className="bg-white shadow-xl border border-gray-200 rounded-sm relative"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  height: 'auto',
                  aspectRatio: '1/1.414',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <HtmlRenderer 
                  key={key} 
                  html={htmlContent} 
                  css={cssStyles} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 