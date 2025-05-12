import { Suspense } from "react";
import { Metadata } from "next";

import { getPublicTemplates } from "@/actions/templates";
import TemplatesGrid from "./components/templates-grid";
import TemplateFilters from "./components/template-filters";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Browse Templates",
  description: "Browse our collection of professional resume templates",
};

export default async function BrowseTemplatesPage() {
  const { templates, error } = await getPublicTemplates();
  
  const templateCount = templates?.length || 0;

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="w-full bg-blue-50 dark:bg-slate-900 rounded-lg p-8 md:p-10 mb-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your Professional <span className="text-primary">Journey</span>, Amplified
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Generate top-tier resumes and cover letters in seconds powered by AI.
            Choose from {templateCount} professionally designed templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gap-2" size="lg">
              <Plus className="h-4 w-4" />
              Create Resume
            </Button>
            <Button variant="outline" className="gap-2" size="lg">
              <Search className="h-4 w-4" />
              Browse All Templates
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6">
        <Heading title="Template Gallery" description="Find the perfect resume template for your next opportunity" />
        <Separator className="my-4" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 px-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down your search</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <TemplateFilters />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TemplatesGrid templates={templates || []} error={error} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 