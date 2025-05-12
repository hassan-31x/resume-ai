"use client";

import { useState } from "react";
import Image from "next/image";
import { Template } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusCircle, Eye, FileEdit, Clock, User, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type TemplateWithCreator = Template & {
  createdBy: {
    name: string | null;
    image: string | null;
  };
};

interface TemplatesGridProps {
  templates: TemplateWithCreator[];
  error?: string;
}

export default function TemplatesGrid({ templates, error }: TemplatesGridProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-destructive text-center">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">No templates found</h3>
        <p className="text-muted-foreground text-center mt-2">
          We couldn&apos;t find any templates matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="transition-all duration-200 hover:translate-y-[-4px]"
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
        >
          <Card 
            className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[1.4/1] bg-muted overflow-hidden">
              {template.thumbnail ? (
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover transition-transform duration-300"
                  style={{
                    transform: hoveredTemplate === template.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <FileEdit className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
              )}
              {template.isAdminCreated && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Official
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="p-4 pb-2">
              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {template.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-2 flex-grow">
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="outline" className="bg-primary/5">{template.category}</Badge>
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-muted/50">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-muted/50">
                    +{template.tags.length - 2}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={template.createdBy.image || ""} alt={template.createdBy.name || "Creator"} />
                    <AvatarFallback className="text-[10px]">{template.createdBy.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{template.createdBy.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/browse/${template.id}`)}
                disabled={isLoading === template.id}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() => {
                  setIsLoading(template.id);
                  router.push(`/editor/new?template=${template.id}`);
                }}
                disabled={isLoading === template.id}
                size="sm"
                className="ml-2"
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
} 