"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Template } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileEdit, User, Calendar, Eye, Code, Download, Star, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import HtmlRenderer from "@/components/html-renderer";
import { useToast } from "@/components/ui/use-toast";

type TemplateWithCreator = Template & {
  createdBy: {
    name: string | null;
    image: string | null;
  };
};

interface TemplateViewProps {
  template: TemplateWithCreator;
}

export default function TemplateView({ template }: TemplateViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [renderError, setRenderError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("preview");
  
  const handleUseTemplate = () => {
    setIsLoading(true);
    router.push(`/editor/new?template=${template.id}`);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRenderError = () => {
    setRenderError(true);
  };

  const handleRenderSuccess = () => {
    setRenderError(false);
  };

  // Copy content to clipboard
  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast({
          title: "Content copied",
          description: `${type} copied to clipboard!`,
        });
      })
      .catch((err) => {
        console.error('Failed to copy content: ', err);
        toast({
          title: "Failed to copy content",
          description: "Failed to copy content to clipboard",
        });
      });
  };

  // Apply styling variables to the CSS
  const getComputedCss = () => {
    return template.cssStyles.replace(/var\(--primary-color\)/g, template.primaryColor)
      .replace(/var\(--secondary-color\)/g, template.secondaryColor)
      .replace(/var\(--font-family\)/g, template.fontFamily)
      .replace(/var\(--font-size\)/g, `${template.fontSize}px`)
      .replace(/var\(--line-height\)/g, template.lineHeight.toString())
      .replace(/var\(--section-spacing\)/g, `${template.sectionSpacing}px`)
      .replace(/var\(--item-spacing\)/g, `${template.itemSpacing}px`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      {/* Template Preview */}
      <div className="flex flex-col space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <Tabs defaultValue="preview" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    Code
                  </TabsTrigger>
                </TabsList>
                
                {activeTab === "preview" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPreviewKey(prev => prev + 1)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Refresh Preview
                  </Button>
                )}
              </div>
              
              <TabsContent value="preview" className="mt-4">
                <div className="bg-card p-8 rounded-md border flex items-center justify-center" style={{ minHeight: '700px' }}>
                  {renderError && template.thumbnail ? (
                    <div className="relative w-full" style={{ height: '700px' }}>
                      <Image
                        src={template.thumbnail}
                        alt={template.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 text-center text-sm text-muted-foreground">
                        Showing thumbnail image as fallback. The HTML content could not be rendered.
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex justify-center items-center py-5">
                      <div 
                        className="bg-white shadow-xl border border-gray-200 rounded-sm relative overflow-hidden page-with-fold"
                        style={{
                          width: '100%',
                          maxWidth: '420px',
                          height: 'auto',
                          aspectRatio: '1/1.414',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                          background: 'linear-gradient(to right, #f9f9f9 0%, #ffffff 50%, #f9f9f9 100%)'
                        }}
                      >
                        {/* Page fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 z-10 border-t-[25px] border-r-[25px] border-t-gray-200 border-r-white" style={{ boxShadow: '-2px 2px 3px rgba(0,0,0,0.1)' }}></div>
                        
                        <div className="absolute top-0 left-0 w-full h-full">
                          <HtmlRenderer 
                            key={previewKey}
                            html={template.htmlContent} 
                            css={getComputedCss()} 
                            onError={handleRenderError}
                            onRender={handleRenderSuccess}
                            className="h-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-auto max-h-[400px] relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-zinc-100" onClick={() => copyToClipboard(template.htmlContent, "HTML")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy HTML</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">HTML</h3>
                    <pre className="font-mono text-sm whitespace-pre-wrap">{template.htmlContent}</pre>
                  </div>
                  
                  <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-auto max-h-[400px] relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-zinc-100" onClick={() => copyToClipboard(template.cssStyles, "CSS")}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy CSS</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">CSS</h3>
                    <pre className="font-mono text-sm whitespace-pre-wrap">{template.cssStyles}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Template Details */}
      <div className="flex flex-col space-y-4">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Template Details</h3>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={template.createdBy.image || ""} alt={template.createdBy.name || "Creator"} />
                    <AvatarFallback>{template.createdBy.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{template.createdBy.name || (template.isAdminCreated ? "Admin" : "Unknown")}</p>
                    <p className="text-xs text-muted-foreground">Template Creator</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Added on {formatDate(template.createdAt)}</span>
                  </div>
                  
                  {template.isAdminCreated && (
                    <div className="flex items-center text-sm space-x-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">Official Template</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Category</h3>
              <Badge variant="secondary" className="bg-primary/10">{template.category}</Badge>
            </div>
            
            {template.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-muted/50">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-2">Styling</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: template.primaryColor }}
                  />
                  <span className="text-xs">Primary Color</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: template.secondaryColor }}
                  />
                  <span className="text-xs">Secondary Color</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs">Font: {template.fontFamily.split(',')[0].replace(/'/g, '')}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleUseTemplate}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Use This Template"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 