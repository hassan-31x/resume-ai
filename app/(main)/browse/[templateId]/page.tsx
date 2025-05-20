import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTemplateById } from "@/actions/templates";
import TemplateView from "../_components/template-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface TemplatePageProps {
  params: {
    templateId: string;
  };
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { template, error } = await getTemplateById(params.templateId);
  
  if (error || !template) {
    return {
      title: "Template not found",
    };
  }
  
  return {
    title: `${template.name} | Resume Template`,
    description: template.description,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { template, error } = await getTemplateById(params.templateId);
  
  if (error || !template) {
    notFound();
  }
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/browse">Templates</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{template.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-3xl font-bold">{template.name}</h1>
              {template.isAdminCreated && (
                <Badge variant="secondary" className="ml-2">Official</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{template.description}</p>
          </div>
          <Link href="/browse">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </Link>
        </div>
        <Separator className="my-4" />
      </div>
      
      <TemplateView template={template} />
    </div>
  );
} 