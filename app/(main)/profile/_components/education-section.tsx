"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  GraduationCap,
  Plus, 
  Pencil, 
  Trash2, 
  Calendar as CalendarIcon,
  MapPin
} from "lucide-react";
import { 
  getUserEducation, 
  addEducation, 
  updateEducation, 
  deleteEducation
} from "@/actions/user-info";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define interfaces for education data
interface EducationData {
  id?: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string | null;
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrentlyStudying?: boolean;
  gpa?: string | null;
  description?: string | null;
  achievements?: string[];
  relevantCourses?: string[];
  userId?: string;
}

interface EducationFormData {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | null;
  endDate: Date | null;
  isCurrentlyStudying: boolean;
  location: string;
  description: string;
  gpa: string;
}

export default function EducationSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(null);
  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [educationForm, setEducationForm] = useState<EducationFormData>({
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: null,
    endDate: null,
    isCurrentlyStudying: false,
    location: "",
    description: "",
    gpa: ""
  });

  // Load educations on component mount
  useEffect(() => {
    loadEducations();
  }, []);

  async function loadEducations() {
    const { education, error } = await getUserEducation();
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setEducationList(education || []);
  }

  // Handle education form changes
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle degree select change
  const handleDegreeChange = (value: string) => {
    setEducationForm(prev => ({
      ...prev,
      degree: value
    }));
  };

  // Handle currently studying checkbox change
  const handleCurrentlyStudyingChange = (checked: boolean) => {
    setEducationForm(prev => ({
      ...prev,
      isCurrentlyStudying: checked,
      endDate: checked ? null : prev.endDate
    }));
  };

  // Reset education form
  const resetEducationForm = () => {
    setEducationForm({
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null,
      endDate: null,
      isCurrentlyStudying: false,
      location: "",
      description: "",
      gpa: ""
    });
    setIsEditMode(false);
    setCurrentEducationId(null);
  };

  // Open education form for editing
  const editEducation = (education: EducationData) => {
    setIsEditMode(true);
    setCurrentEducationId(education.id || null);
    setEducationForm({
      schoolName: education.schoolName || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate ? new Date(education.startDate) : null,
      endDate: education.endDate ? new Date(education.endDate) : null,
      isCurrentlyStudying: education.isCurrentlyStudying || false,
      location: education.location || "",
      description: education.description || "",
      gpa: education.gpa || ""
    });
    setIsEducationDialogOpen(true);
  };

  // Handle save education
  const handleSaveEducation = async () => {
    // Validate form
    if (!educationForm.schoolName || !educationForm.degree || !educationForm.fieldOfStudy || !educationForm.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isEditMode && currentEducationId) {
        // Update existing education
        const { error, success } = await updateEducation(currentEducationId, {
          schoolName: educationForm.schoolName,
          degree: educationForm.degree,
          fieldOfStudy: educationForm.fieldOfStudy,
          startDate: educationForm.startDate || undefined,
          endDate: educationForm.endDate,
          isCurrentlyStudying: educationForm.isCurrentlyStudying,
          location: educationForm.location || null,
          description: educationForm.description || null,
          gpa: educationForm.gpa || null
        });
        
        if (error) {
          throw new Error(error);
        }
        
        if (success) {
          toast({
            title: "Success",
            description: "Education updated successfully",
          });
        }
      } else {
        // Add new education
        const { error, success } = await addEducation({
          schoolName: educationForm.schoolName,
          degree: educationForm.degree,
          fieldOfStudy: educationForm.fieldOfStudy,
          startDate: educationForm.startDate || undefined,
          endDate: educationForm.endDate,
          isCurrentlyStudying: educationForm.isCurrentlyStudying,
          location: educationForm.location || null,
          description: educationForm.description || null,
          gpa: educationForm.gpa || null
        });
        
        if (error) {
          throw new Error(error);
        }
        
        if (success) {
          toast({
            title: "Success",
            description: "Education added successfully",
          });
        }
      }
      
      resetEducationForm();
      setIsEducationDialogOpen(false);
      await loadEducations();
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save education",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete education
  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, success } = await deleteEducation(id);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        toast({
          title: "Success",
          description: "Education deleted successfully",
        });
        await loadEducations();
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete education",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date range for display
  const formatDateRange = (startDate?: Date, endDate?: Date | null, isCurrentlyStudying?: boolean) => {
    const formattedStart = startDate ? format(new Date(startDate), 'MMM yyyy') : '';
    
    if (isCurrentlyStudying) {
      return `${formattedStart} - Present`;
    }
    
    const formattedEnd = endDate ? format(new Date(endDate), 'MMM yyyy') : '';
    
    if (formattedStart && formattedEnd) {
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart || '';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Add your educational background and achievements
          </CardDescription>
        </div>
        <Button 
          onClick={() => {
            resetEducationForm();
            setIsEducationDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Education
        </Button>
      </CardHeader>
      <CardContent>
        {educationList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No education entries added yet</p>
            <p className="text-sm">Add your educational background and achievements</p>
          </div>
        ) : (
          <div className="space-y-6">
            {educationList.map((education) => (
              <div key={education.id} className="border rounded-lg p-5 relative">
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => editEducation(education)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteEducation(education.id as string)}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
                
                <div className="pr-16">
                  <h3 className="font-medium text-lg">{education.schoolName}</h3>
                  <p>{education.degree} in {education.fieldOfStudy}</p>
                  <div className="flex flex-col sm:flex-row sm:gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      <span>
                        {formatDateRange(education.startDate, education.endDate, education.isCurrentlyStudying)}
                      </span>
                    </div>
                    {education.location && (
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        <span>{education.location}</span>
                      </div>
                    )}
                    {education.gpa && (
                      <div className="flex items-center">
                        <span>GPA: {education.gpa}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {education.description && (
                  <div className="mt-3 text-sm">
                    <p>{education.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Education Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Education" : "Add Education"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update your education details" 
                : "Add details about your educational background"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School/University <span className="text-destructive">*</span></Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={educationForm.schoolName}
                onChange={handleEducationChange}
                placeholder="e.g. Stanford University"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree <span className="text-destructive">*</span></Label>
                <Select 
                  onValueChange={handleDegreeChange} 
                  value={educationForm.degree}
                >
                  <SelectTrigger id="degree">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor of Arts">Bachelor of Arts (BA)</SelectItem>
                    <SelectItem value="Bachelor of Science">Bachelor of Science (BS)</SelectItem>
                    <SelectItem value="Master of Arts">Master of Arts (MA)</SelectItem>
                    <SelectItem value="Master of Science">Master of Science (MS)</SelectItem>
                    <SelectItem value="Master of Business Administration">Master of Business Administration (MBA)</SelectItem>
                    <SelectItem value="Doctor of Philosophy">Doctor of Philosophy (PhD)</SelectItem>
                    <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                    <SelectItem value="High School Diploma">High School Diploma</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study <span className="text-destructive">*</span></Label>
                <Input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={educationForm.fieldOfStudy}
                  onChange={handleEducationChange}
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !educationForm.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {educationForm.startDate ? format(educationForm.startDate, "MMMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={educationForm.startDate || undefined}
                      onSelect={(date) => setEducationForm(prev => ({ 
                        ...prev, 
                        startDate: date || null 
                      }))}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1970}
                      toYear={2030}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isCurrentlyStudying" 
                      checked={educationForm.isCurrentlyStudying}
                      onCheckedChange={handleCurrentlyStudyingChange}
                    />
                    <label 
                      htmlFor="isCurrentlyStudying" 
                      className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Currently studying
                    </label>
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        (!educationForm.endDate || educationForm.isCurrentlyStudying) && "text-muted-foreground"
                      )}
                      disabled={educationForm.isCurrentlyStudying}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {educationForm.isCurrentlyStudying 
                        ? "Present" 
                        : educationForm.endDate 
                          ? format(educationForm.endDate, "MMMM yyyy") 
                          : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={educationForm.endDate || undefined}
                      onSelect={(date) => setEducationForm(prev => ({ 
                        ...prev, 
                        endDate: date || null 
                      }))}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1970}
                      toYear={2030}
                      disabled={(date) => 
                        educationForm.startDate ? date < educationForm.startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={educationForm.location}
                  onChange={handleEducationChange}
                  placeholder="e.g. Stanford, CA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  value={educationForm.gpa}
                  onChange={handleEducationChange}
                  placeholder="e.g. 3.8/4.0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={educationForm.description}
                onChange={handleEducationChange}
                placeholder="Describe any notable achievements, coursework, or extracurricular activities"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetEducationForm();
                setIsEducationDialogOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEducation} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 