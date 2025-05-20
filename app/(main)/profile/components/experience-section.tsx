"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase } from "lucide-react";

export default function ExperienceSection() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Add your professional work experiences and accomplishments
          </CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <Plus size={16} /> Add Experience
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>No work experiences added yet</p>
          <p className="text-sm">Add your professional work history and accomplishments</p>
        </div>
      </CardContent>
    </Card>
  );
} 