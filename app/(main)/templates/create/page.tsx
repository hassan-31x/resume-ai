"use client";

import { useState } from "react";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { Loader2, Save, Download, Eye, Code, ArrowLeft, CheckCircle2 } from "lucide-react";
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
import { TemplatePreview } from "../components/template-preview";
import { useToast } from "@/components/ui/use-toast";
import { createTemplate } from "@/actions/create-template";
import type { CreateTemplateData } from "@/actions/create-template";

export default function CreateTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"editor" | "metadata">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Template data
  const [templateData, setTemplateData] = useState<CreateTemplateData>({
    name: "",
    description: "",
    category: "PROFESSIONAL",
    tags: [],
    latexCode: `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}

\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{8pt}

\\begin{document}

\\begin{center}
  {\\LARGE\\textbf{John Doe}}\\\\
  123 Main Street, City, State 12345\\\\
  (123) 456-7890 $|$ john.doe@email.com $|$ linkedin.com/in/johndoe
\\end{center}

\\section{Education}
\\textbf{University of Example} \\hfill \\textit{City, State}\\\\
Bachelor of Science in Computer Science \\hfill \\textit{Aug 2018 - May 2022}\\\\
GPA: 3.85/4.0

\\section{Experience}
\\textbf{Software Engineer} \\hfill \\textit{Jun 2022 - Present}\\\\
\\textit{Tech Company Inc.} \\hfill \\textit{City, State}
\\begin{itemize}[leftmargin=*]
  \\item Developed and maintained web applications using React, Node.js, and MongoDB
  \\item Collaborated with cross-functional teams to design and implement new features
  \\item Improved application performance by 30\\% through code optimization
\\end{itemize}

\\textbf{Software Engineering Intern} \\hfill \\textit{May 2021 - Aug 2021}\\\\
\\textit{Startup XYZ} \\hfill \\textit{City, State}
\\begin{itemize}[leftmargin=*]
  \\item Assisted in developing RESTful APIs using Express.js and MongoDB
  \\item Implemented responsive UI components using React and Material-UI
  \\item Participated in daily stand-ups and biweekly sprint planning meetings
\\end{itemize}

\\section{Projects}
\\textbf{Personal Portfolio Website}
\\begin{itemize}[leftmargin=*]
  \\item Designed and developed a responsive personal portfolio website using React and Tailwind CSS
  \\item Implemented dark mode and animations using Framer Motion
  \\item Deployed the website using Vercel with CI/CD pipeline
\\end{itemize}

\\textbf{Task Management Application}
\\begin{itemize}[leftmargin=*]
  \\item Created a full-stack task management application using MERN stack
  \\item Implemented user authentication using JWT and bcrypt
  \\item Added features like task categorization, due dates, and notifications
\\end{itemize}

\\section{Skills}
\\textbf{Programming Languages:} JavaScript, TypeScript, Python, Java, C++\\\\
\\textbf{Frontend:} React, HTML, CSS, Tailwind CSS, Material-UI\\\\
\\textbf{Backend:} Node.js, Express.js, Django, Spring Boot\\\\
\\textbf{Databases:} MongoDB, PostgreSQL, MySQL\\\\
\\textbf{Tools:} Git, Docker, AWS, Firebase, Jira

\\end{document}`,
    isPublic: true,
  });
  
  const [tagInput, setTagInput] = useState("");
  
  const handleLatexChange = (code: string) => {
    setTemplateData(prev => ({ ...prev, latexCode: code }));
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
  
  const handleSaveTemplate = async () => {
    setIsSaving(true);
    
    try {
      const result = await createTemplate(templateData);
      
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
            onClick={() => setActiveTab(activeTab === "editor" ? "metadata" : "editor")}
          >
            {activeTab === "editor" ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Edit Metadata
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Edit LaTeX
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleSaveTemplate}
            disabled={isSaving || !templateData.name || !templateData.latexCode}
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
      
      <Tabs defaultValue="editor" value={activeTab} onValueChange={(value) => setActiveTab(value as "editor" | "metadata")}>
        <TabsContent value="editor" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LaTeX Editor */}
            <Card className="p-4 h-[calc(100vh-12rem)] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">LaTeX Editor</h2>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download LaTeX
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="flex-grow min-h-0">
                <TemplateEditor
                  value={templateData.latexCode}
                  onChange={handleLatexChange}
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
              <div className="flex-grow min-h-0 overflow-auto bg-white rounded border">
                <TemplatePreview 
                  latexCode={templateData.latexCode} 
                  isLoading={isPreviewLoading}
                  onLoaded={() => setIsPreviewLoading(false)}
                />
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metadata" className="m-0">
          <Card className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
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
                  onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 