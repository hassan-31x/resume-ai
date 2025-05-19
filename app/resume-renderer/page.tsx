'use client';

import { useState, useEffect } from 'react';
import HtmlRenderer from '@/components/html-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, Eye, Code, RefreshCw } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { dummyResumeData } from '../constants/dummy-resume-data';
import { assembleTemplate } from '../utils/template-assembler';

// Sample template components
const sampleTemplate = {
  headerHTML: `<header class="header">
  <h1>{{fullName}}</h1>
  <p class="contact-info">{{jobTitle}}</p>
</header>`,
  
  contactHTML: `<p class="contact-info">
  {{location}} | {{phone}} | {{email}} | {{linkedin}}
</p>`,
  
  educationTitleHTML: `<section class="resume-section">
  <h2>Education</h2>`,
  
  educationItemHTML: `<div class="resume-item">
      <div class="item-header">
    <h3>{{school}}</h3>
    <span class="location">{{location}}</span>
      </div>
      <div class="item-subheader">
    <p>{{degree}}</p>
    <span class="date">{{startDate}} - {{endDate}}</span>
      </div>
  <p>GPA: {{gpa}}</p>
</div>`,
  
  experienceTitleHTML: `<section class="resume-section">
  <h2>Experience</h2>`,
  
  experienceItemHTML: `<div class="resume-item">
      <div class="item-header">
    <h3>{{title}}</h3>
    <span class="location">{{company}}, {{location}}</span>
      </div>
      <div class="item-subheader">
        <p></p>
    <span class="date">{{startDate}} - {{endDate}}</span>
      </div>
      <ul>
    {{#responsibilities}}
    <li>{{.}}</li>
    {{/responsibilities}}
      </ul>
</div>`,
  
  skillsTitleHTML: `<section class="resume-section">
  <h2>Skills</h2>`,
  
  skillsItemHTML: `<div class="skills-grid">
      <div class="skill-category">
    <h3>Languages:</h3>
    <p>{{languages}}</p>
      </div>
      <div class="skill-category">
    <h3>Frameworks:</h3>
    <p>{{frameworks}}</p>
      </div>
      <div class="skill-category">
        <h3>Databases:</h3>
    <p>{{databases}}</p>
      </div>
      <div class="skill-category">
        <h3>Tools:</h3>
    <p>{{tools}}</p>
      </div>
</div>`,
  
  projectsTitleHTML: `<section class="resume-section">
  <h2>Projects</h2>`,
  
  projectsItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{title}}</h3>
    <span class="location">{{link}}</span>
    </div>
  <p>{{description}}</p>
  <ul>
    {{#points}}
    <li>{{.}}</li>
    {{/points}}
  </ul>
</div>`,
  
  cssStyles: `.resume {
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
`
};

// Current active component being edited
type ComponentType = 'header' | 'contact' | 'educationTitle' | 'educationItem' | 
                      'experienceTitle' | 'experienceItem' | 'skillsTitle' | 'skillsItem' |
                      'projectsTitle' | 'projectsItem' | 'css';

export default function ResumeRendererPage() {
  const { toast } = useToast();
  
  // State for template components
  const [template, setTemplate] = useState(sampleTemplate);
  const [activeComponent, setActiveComponent] = useState<ComponentType>('header');
  const [assembledHTML, setAssembledHTML] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [key, setKey] = useState<number>(0);

  // Map component types to their properties in the template object
  const componentMap = {
    header: 'headerHTML',
    contact: 'contactHTML',
    educationTitle: 'educationTitleHTML',
    educationItem: 'educationItemHTML',
    experienceTitle: 'experienceTitleHTML',
    experienceItem: 'experienceItemHTML',
    skillsTitle: 'skillsTitleHTML',
    skillsItem: 'skillsItemHTML',
    projectsTitle: 'projectsTitleHTML',
    projectsItem: 'projectsItemHTML',
    css: 'cssStyles'
  };

  // Get the currently active component's content
  const getActiveComponentContent = () => {
    const propertyName = componentMap[activeComponent];
    return template[propertyName as keyof typeof template] || '';
  };

  // Update the active component's content
  const updateComponentContent = (value: string) => {
    const propertyName = componentMap[activeComponent];
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      [propertyName]: value
    }));
  };

  // Assemble the HTML from components when the template changes
  useEffect(() => {
    setAssembledHTML(assembleTemplate(template as any, dummyResumeData));
  }, [template]);

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
    const blob = new Blob([assembledHTML], { type: "text/html" });
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
    const blob = new Blob([template.cssStyles], { type: "text/css" });
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

  const handleDownloadTemplate = () => {
    const templateData = JSON.stringify(template, null, 2);
    const blob = new Blob([templateData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "Your template components have been downloaded as JSON.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Resume Template Editor</h1>
        <div className="flex gap-2">
          <Button onClick={handleRender} disabled={isRendering}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Preview
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="header" onValueChange={(value) => setActiveComponent(value as ComponentType)}>
            <div className="flex items-center justify-between mb-2">
              <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="educationTitle">Edu Title</TabsTrigger>
                <TabsTrigger value="educationItem">Edu Item</TabsTrigger>
                <TabsTrigger value="experienceTitle">Exp Title</TabsTrigger>
                <TabsTrigger value="experienceItem">Exp Item</TabsTrigger>
                <TabsTrigger value="skillsTitle">Skills Title</TabsTrigger>
                <TabsTrigger value="skillsItem">Skills Item</TabsTrigger>
                <TabsTrigger value="projectsTitle">Projects Title</TabsTrigger>
                <TabsTrigger value="projectsItem">Projects Item</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>
            </div>
              
            <div className="flex justify-end gap-2 mb-2">
                <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
                  <FileDown className="h-4 w-4 mr-1" /> HTML
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSS}>
                  <FileDown className="h-4 w-4 mr-1" /> CSS
                </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <FileDown className="h-4 w-4 mr-1" /> Template
              </Button>
            </div>
            
              <Card>
              <CardContent className="p-0 h-[calc(100vh-330px)]">
                  <Editor
                    height="100%"
                  defaultLanguage={activeComponent === 'css' ? 'css' : 'html'}
                  value={getActiveComponentContent()}
                  onChange={(value) => updateComponentContent(value || "")}
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
                  html={assembledHTML} 
                  css={template.cssStyles} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 