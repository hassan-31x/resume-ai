"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getUserPersonalInfo, updatePersonalInfo } from "@/actions/user-info";

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  country: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  portfolioUrl: string;
  professionalSummary: string;
}

export default function PersonalInfoForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData>({
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
    loadPersonalInfo();
  }, []);

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

  // Handle input changes
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save personal info
  const handleSavePersonalInfo = async () => {
    setIsLoading(true);
    
    try {
      const { error, success } = await updatePersonalInfo(personalInfo);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        toast({
          title: "Success",
          description: "Personal information updated successfully",
        });
      }
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save personal information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Professional Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={personalInfo.jobTitle}
              onChange={handlePersonalInfoChange}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              name="website"
              value={personalInfo.website}
              onChange={handlePersonalInfoChange}
              placeholder="https://johndoe.com"
            />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={personalInfo.city}
                onChange={handlePersonalInfoChange}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                name="state"
                value={personalInfo.state}
                onChange={handlePersonalInfoChange}
                placeholder="California"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={personalInfo.country}
                onChange={handlePersonalInfoChange}
                placeholder="United States"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              value={personalInfo.linkedinUrl}
              onChange={handlePersonalInfoChange}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Profile</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={personalInfo.githubUrl}
              onChange={handlePersonalInfoChange}
              placeholder="https://github.com/johndoe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter/X Profile</Label>
            <Input
              id="twitterUrl"
              name="twitterUrl"
              value={personalInfo.twitterUrl}
              onChange={handlePersonalInfoChange}
              placeholder="https://twitter.com/johndoe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              name="portfolioUrl"
              value={personalInfo.portfolioUrl}
              onChange={handlePersonalInfoChange}
              placeholder="https://johndoe.portfolio.com"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="professionalSummary">Professional Summary</Label>
            <Textarea
              id="professionalSummary"
              name="professionalSummary"
              value={personalInfo.professionalSummary}
              onChange={handlePersonalInfoChange}
              placeholder="Write a brief summary of your professional background, skills, and career objectives..."
              rows={5}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSavePersonalInfo} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
} 