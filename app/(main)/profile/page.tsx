"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User, UserCircle, Briefcase, GraduationCap, FolderKanban, Award, BookOpen, PanelRight } from "lucide-react";
import { getUserPersonalInfo, updatePersonalInfo } from "@/actions/user-info";

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    country: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    portfolioUrl: "",
    professionalSummary: "",
  });

  // Load user's personal information
  useEffect(() => {
    async function loadPersonalInfo() {
      const { personalInfo, error } = await getUserPersonalInfo();
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      if (personalInfo) {
        setPersonalInfo({
          firstName: personalInfo.firstName || "",
          lastName: personalInfo.lastName || "",
          jobTitle: personalInfo.jobTitle || "",
          email: personalInfo.email || "",
          phone: personalInfo.phone || "",
          website: personalInfo.website || "",
          city: personalInfo.city || "",
          state: personalInfo.state || "",
          country: personalInfo.country || "",
          linkedinUrl: personalInfo.linkedinUrl || "",
          githubUrl: personalInfo.githubUrl || "",
          twitterUrl: personalInfo.twitterUrl || "",
          portfolioUrl: personalInfo.portfolioUrl || "",
          professionalSummary: personalInfo.professionalSummary || "",
        });
      }
    }
    
    loadPersonalInfo();
  }, [toast]);

  // Handle input changes
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save personal information
  const handleSavePersonalInfo = async () => {
    setIsLoading(true);
    
    const { error, success } = await updatePersonalInfo(personalInfo);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    if (success) {
      toast({
        title: "Success",
        description: "Personal information saved successfully.",
      });
    }
  };

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Information</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information which will be used in your resumes
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="overflow-hidden rounded-md">
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "personal" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("personal")}
                >
                  <User size={18} />
                  <span>Personal</span>
                </div>
                <Separator />
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "experience" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("experience")}
                >
                  <Briefcase size={18} />
                  <span>Experience</span>
                </div>
                <Separator />
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "education" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("education")}
                >
                  <GraduationCap size={18} />
                  <span>Education</span>
                </div>
                <Separator />
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "projects" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("projects")}
                >
                  <FolderKanban size={18} />
                  <span>Projects</span>
                </div>
                <Separator />
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "skills" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("skills")}
                >
                  <BookOpen size={18} />
                  <span>Skills</span>
                </div>
                <Separator />
                <div 
                  className={`cursor-pointer flex items-center gap-3 px-4 py-3 ${activeTab === "certificates" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setActiveTab("certificates")}
                >
                  <Award size={18} />
                  <span>Certificates</span>
                </div>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === "personal" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={personalInfo.jobTitle}
                    onChange={handlePersonalInfoChange}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={personalInfo.city}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={personalInfo.state}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={personalInfo.country}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>

                <Separator />
                
                <h3 className="font-medium text-lg">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={personalInfo.website}
                    onChange={handlePersonalInfoChange}
                    placeholder="https://example.com"
                  />
                </div>

                <Separator />
                
                <h3 className="font-medium text-lg">Social Profiles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={personalInfo.linkedinUrl}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub</Label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      value={personalInfo.githubUrl}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter</Label>
                    <Input
                      id="twitterUrl"
                      name="twitterUrl"
                      value={personalInfo.twitterUrl}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio</Label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      value={personalInfo.portfolioUrl}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://portfolio.com"
                    />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="professionalSummary">Professional Summary</Label>
                  <Textarea
                    id="professionalSummary"
                    name="professionalSummary"
                    value={personalInfo.professionalSummary}
                    onChange={handlePersonalInfoChange}
                    placeholder="Write a short professional summary about yourself..."
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSavePersonalInfo} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Information"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "experience" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add your work history and professional experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This section will be implemented next.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "education" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add your educational background and academic achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This section will be implemented next.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "projects" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Showcase your notable projects and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This section will be implemented next.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "skills" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add your technical and professional skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This section will be implemented next.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "certificates" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Add your certifications and professional credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This section will be implemented next.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 