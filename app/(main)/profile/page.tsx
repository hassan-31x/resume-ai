"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  Award, 
  Layers 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Import section components
import PersonalInfoForm from "./_components/personal-info-form";
import ExperienceSection from "./_components/experience-section";
import EducationSection from "./_components/education-section";
import ProjectsSection from "./_components/projects-section";
import CertificatesSection from "./_components/certificates-section";
import SkillsSection from "./_components/skills-section";

// Profile page component
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal and professional information for use in your resumes
        </p>
      </div>

      <Tabs 
        defaultValue="personal-info" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 h-auto p-1">
          <TabsTrigger 
            value="personal-info" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <User size={18} />
            <span className="text-xs">Personal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <Briefcase size={18} />
            <span className="text-xs">Experience</span>
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <GraduationCap size={18} />
            <span className="text-xs">Education</span>
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <FolderKanban size={18} />
            <span className="text-xs">Projects</span>
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <Layers size={18} />
            <span className="text-xs">Skills</span>
          </TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="flex flex-col items-center gap-1 py-2 h-auto"
          >
            <Award size={18} />
            <span className="text-xs">Certificates</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal-info" className="border-none p-0">
          <PersonalInfoForm />
        </TabsContent>

        {/* Work Experience */}
        <TabsContent value="experience" className="border-none p-0">
          <ExperienceSection />
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="border-none p-0">
          <EducationSection />
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="border-none p-0">
          <ProjectsSection />
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="border-none p-0">
          <SkillsSection />
        </TabsContent>

        {/* Certificates */}
        <TabsContent value="certificates" className="border-none p-0">
          <CertificatesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
} 