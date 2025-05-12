"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Template } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileEdit, User, Calendar, Eye, Code, Download, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      {/* Template Preview */}
      <div className="flex flex-col space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="preview" className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center">
                  <Code className="mr-2 h-4 w-4" />
                  LaTeX Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <div className="bg-card p-4 rounded-md border min-h-[600px] flex items-center justify-center">
                  {template.thumbnail ? (
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={template.thumbnail}
                        alt={template.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center">
                      <FileEdit className="h-16 w-16 mb-4 opacity-20" />
                      <p>Preview not available</p>
                      <p className="text-sm mt-2">Please check the LaTeX code for details</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <div className="bg-zinc-950 text-zinc-50 p-4 rounded-md overflow-auto max-h-[600px] relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <pre className="font-mono text-sm whitespace-pre-wrap">{template.latexCode}</pre>
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