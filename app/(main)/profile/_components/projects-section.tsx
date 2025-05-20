"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";

export default function ProjectsSection() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Add your personal and professional projects
          </CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <Plus size={16} /> Add Project
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <FolderKanban className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>No projects added yet</p>
          <p className="text-sm">Showcase your work by adding projects you've built</p>
        </div>
      </CardContent>
    </Card>
  );
} 