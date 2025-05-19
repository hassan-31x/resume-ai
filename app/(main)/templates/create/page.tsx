"use client";

import { useState } from "react";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { Loader2, Save, Download, Eye, Code, ArrowLeft, CheckCircle2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TemplateEditor } from "../components/template-editor";
import { useToast } from "@/components/ui/use-toast";
import { createTemplate } from "@/actions/create-template";
import type { CreateTemplateData } from "@/actions/create-template";
import HtmlRenderer from "@/components/html-renderer";

export default function CreateTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"editor" | "metadata" | "styling">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Template data
  const [templateData, setTemplateData] = useState<{
    name: string;
    description: string;
    category: "PROFESSIONAL" | "ACADEMIC" | "CREATIVE" | "TECHNICAL" | "ENTRY_LEVEL" | "EXECUTIVE" | "OTHER";
    tags: string[];
    htmlContent: string;
    cssStyles: string;
    isPublic: boolean;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    sectionSpacing: number;
    itemSpacing: number;
    thumbnail?: string;
  }>({
    name: "",
    description: "",
    category: "PROFESSIONAL",
    tags: [],
    htmlContent: `<div class="resume">
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
    <h2>Projects</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Personal Portfolio Website</h3>
      </div>
      <ul>
        <li>Designed and developed a responsive personal portfolio website using React and Tailwind CSS</li>
        <li>Implemented dark mode and animations using Framer Motion</li>
        <li>Deployed the website using Vercel with CI/CD pipeline</li>
      </ul>
    </div>
    
    <div class="resume-item">
      <div class="item-header">
        <h3>Task Management Application</h3>
      </div>
      <ul>
        <li>Created a full-stack task management application using MERN stack</li>
        <li>Implemented user authentication using JWT and bcrypt</li>
        <li>Added features like task categorization, due dates, and notifications</li>
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
</div>`,
    cssStyles: `.resume {
  max-width: 100%;
  margin: 0 auto;
  padding: 5%;
  font-family: var(--font-family);
  font-size: 1em;
  line-height: var(--line-height);
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
  color: var(--primary-color);
}

.contact-info {
  margin-top: 0.4em;
  font-size: 0.85em;
}

.resume-section {
  margin-bottom: var(--section-spacing);
}

.resume-section h2 {
  font-size: 1.2em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
  color: var(--primary-color);
}

.resume-item {
  margin-bottom: var(--item-spacing);
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
  color: var(--secondary-color);
  font-size: 0.9em;
}

.date {
  color: var(--secondary-color);
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

/* CSS Variables for styling */
:root {
  --primary-color: var(--primary-color);
  --secondary-color: var(--secondary-color);
  --font-family: var(--font-family);
  --font-size: var(--font-size);
  --line-height: var(--line-height);
  --section-spacing: var(--section-spacing);
  --item-spacing: var(--item-spacing);
}`,
    isPublic: true,
    primaryColor: "#4A6CF7",
    secondaryColor: "#6E82A6",
    fontFamily: "'Inter', sans-serif",
    fontSize: 8,
    lineHeight: 1.5,
    sectionSpacing: 24,
    itemSpacing: 12
  });
  
  const [tagInput, setTagInput] = useState("");
  
  const handleHtmlChange = (code: string) => {
    setTemplateData(prev => ({ ...prev, htmlContent: code }));
  };
  
  const handleCssChange = (code: string) => {
    setTemplateData(prev => ({ ...prev, cssStyles: code }));
  };
  
  const handleAddTag = () => {
    if (tagInput && !templateData.tags.includes(tagInput)) {
      setTemplateData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTemplateData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getComputedCss = () => {
    return templateData.cssStyles.replace(/var\(--primary-color\)/g, templateData.primaryColor)
      .replace(/var\(--secondary-color\)/g, templateData.secondaryColor)
      .replace(/var\(--font-family\)/g, templateData.fontFamily)
      .replace(/var\(--font-size\)/g, `${templateData.fontSize}px`)
      .replace(/var\(--line-height\)/g, templateData.lineHeight.toString())
      .replace(/var\(--section-spacing\)/g, `${templateData.sectionSpacing}px`)
      .replace(/var\(--item-spacing\)/g, `${templateData.itemSpacing}px`);
  };
  
  const handleSaveTemplate = async () => {
    setIsSaving(true);
    
    try {
      const result = await createTemplate({
        ...templateData,
        // Map to match the expected types in createTemplate
        htmlContent: templateData.htmlContent,
        cssStyles: templateData.cssStyles
      });
      
      if (result.error) {
        toast({
          title: "Error saving template",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Template saved!",
          description: "Your template has been saved successfully.",
        });
        
        // Navigate to the template detail page
        if (result.templateId) {
          router.push(`/browse/${result.templateId}`);
        } else {
          router.push("/browse");
        }
      }
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "There was an error saving your template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Template</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const nextTab = activeTab === "editor" 
                ? "metadata" 
                : activeTab === "metadata" 
                  ? "styling" 
                  : "editor";
              setActiveTab(nextTab);
            }}
          >
            {activeTab === "editor" ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Edit Metadata
              </>
            ) : activeTab === "metadata" ? (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Edit Styling
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Edit HTML/CSS
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleSaveTemplate}
            disabled={isSaving || !templateData.name || !templateData.htmlContent || !templateData.cssStyles}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="editor" value={activeTab} onValueChange={(value) => setActiveTab(value as "editor" | "metadata" | "styling")}>
        <TabsContent value="editor" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Code Editor */}
            <Card className="p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">HTML/CSS Editor</h2>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Code
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex-grow min-h-0">
                <TemplateEditor
                  html={templateData.htmlContent}
                  css={templateData.cssStyles}
                  onHtmlChange={handleHtmlChange}
                  onCssChange={handleCssChange}
                />
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewLoading(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Refresh Preview
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex-grow min-h-0 overflow-auto bg-white rounded border flex justify-center items-center p-4">
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
                    key={isPreviewLoading ? Date.now() : undefined}
                    html={templateData.htmlContent} 
                    css={getComputedCss()}
                    onRender={() => setIsPreviewLoading(false)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metadata" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Metadata Form */}
            <Card className="p-6 h-[calc(100vh-12rem)] overflow-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Professional Resume Template" 
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your template..." 
                    className="min-h-[100px]"
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={templateData.category} 
                    onValueChange={(value: "PROFESSIONAL" | "ACADEMIC" | "CREATIVE" | "TECHNICAL" | "ENTRY_LEVEL" | "EXECUTIVE" | "OTHER") => {
                      setTemplateData(prev => ({ ...prev, category: value }));
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="ACADEMIC">Academic</SelectItem>
                      <SelectItem value="CREATIVE">Creative</SelectItem>
                      <SelectItem value="TECHNICAL">Technical</SelectItem>
                      <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                      <SelectItem value="EXECUTIVE">Executive</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex">
                    <Input 
                      id="tags" 
                      placeholder="Add tags..." 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-grow"
                    />
                    <Button type="button" className="ml-2" onClick={handleAddTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {templateData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setActiveTab("styling")}
                    className="min-w-[120px]"
                  >
                    Next: Styling
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewLoading(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Refresh Preview
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex-grow min-h-0 overflow-auto bg-white rounded border flex justify-center items-center p-4">
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
                    key={isPreviewLoading ? Date.now() : undefined}
                    html={templateData.htmlContent} 
                    css={getComputedCss()}
                    onRender={() => setIsPreviewLoading(false)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="styling" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Styling Form */}
            <Card className="p-6 h-[calc(100vh-12rem)] overflow-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Template Styling</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="primaryColor" 
                        type="color" 
                        value={templateData.primaryColor}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        value={templateData.primaryColor}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="secondaryColor" 
                        type="color" 
                        value={templateData.secondaryColor}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input 
                        value={templateData.secondaryColor}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select 
                      value={templateData.fontFamily} 
                      onValueChange={(value) => setTemplateData(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger id="fontFamily">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                        <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
                        <SelectItem value="'Helvetica', sans-serif">Helvetica</SelectItem>
                        <SelectItem value="'Georgia', serif">Georgia</SelectItem>
                        <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                        <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                        <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2 space-y-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="fontSize">Font Size: {templateData.fontSize}px</Label>
                        <span className="text-sm text-muted-foreground">{templateData.fontSize}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">8</span>
                        <input 
                          id="fontSize" 
                          type="range" 
                          min="2" 
                          max="18" 
                          step="1" 
                          value={templateData.fontSize}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 14 }))}
                          className="flex-grow h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">18</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="lineHeight">Line Height: {templateData.lineHeight}</Label>
                        <span className="text-sm text-muted-foreground">{templateData.lineHeight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">1.0</span>
                        <input 
                          id="lineHeight" 
                          type="range" 
                          min="1" 
                          max="2" 
                          step="0.1" 
                          value={templateData.lineHeight}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) || 1.5 }))}
                          className="flex-grow h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">2.0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="sectionSpacing">Section Spacing: {templateData.sectionSpacing}px</Label>
                        <span className="text-sm text-muted-foreground">{templateData.sectionSpacing}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">10</span>
                        <input 
                          id="sectionSpacing" 
                          type="range" 
                          min="10" 
                          max="50"
                          step="2"
                          value={templateData.sectionSpacing}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, sectionSpacing: parseInt(e.target.value) || 24 }))}
                          className="flex-grow h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">50</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="itemSpacing">Item Spacing: {templateData.itemSpacing}px</Label>
                        <span className="text-sm text-muted-foreground">{templateData.itemSpacing}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">5</span>
                        <input 
                          id="itemSpacing" 
                          type="range" 
                          min="5" 
                          max="30"
                          step="1"
                          value={templateData.itemSpacing}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, itemSpacing: parseInt(e.target.value) || 12 }))}
                          className="flex-grow h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">30</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSaveTemplate}
                    disabled={isSaving}
                    className="min-w-[120px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Template"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewLoading(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Refresh Preview
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex-grow min-h-0 overflow-auto bg-white rounded border flex justify-center items-center p-4">
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
                    key={isPreviewLoading ? Date.now() : undefined}
                    html={templateData.htmlContent} 
                    css={getComputedCss()}
                    onRender={() => setIsPreviewLoading(false)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 