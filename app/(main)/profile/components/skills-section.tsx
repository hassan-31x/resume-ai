"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Layers,
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  PlusCircle, 
  Tag
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Define interfaces for the skill data
interface Skill {
  id?: string;
  name: string;
  proficiency?: number;
}

interface SkillCategory {
  id?: string;
  name: string;
  skills: Skill[];
}

interface SkillCategoryFormData {
  name: string;
}

interface SkillFormData {
  name: string;
  proficiency: number;
}

export default function SkillsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  
  // Category dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<SkillCategoryFormData>({
    name: ""
  });
  
  // Skill dialog state
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);
  const [currentCategoryForSkill, setCurrentCategoryForSkill] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<SkillFormData>({
    name: "",
    proficiency: 3
  });

  // Load skill categories on component mount
  useEffect(() => {
    loadSkillCategories();
  }, []);

  async function loadSkillCategories() {
    // Simulated data loading for now
    // This would typically fetch from an API
    const mockCategories = [
      {
        id: "1",
        name: "Programming Languages",
        skills: [
          { id: "1-1", name: "JavaScript", proficiency: 5 },
          { id: "1-2", name: "TypeScript", proficiency: 4 },
          { id: "1-3", name: "Python", proficiency: 3 }
        ]
      },
      {
        id: "2",
        name: "Frameworks",
        skills: [
          { id: "2-1", name: "React", proficiency: 5 },
          { id: "2-2", name: "Next.js", proficiency: 4 },
          { id: "2-3", name: "Express", proficiency: 3 }
        ]
      }
    ];
    
    setSkillCategories(mockCategories);
  }

  // Handle form changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryForm({ ...categoryForm, name: e.target.value });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "proficiency") {
      setSkillForm({ ...skillForm, proficiency: parseInt(value) || 0 });
    } else {
      setSkillForm({ ...skillForm, [name]: value });
    }
  };

  // Reset forms
  const resetCategoryForm = () => {
    setCategoryForm({ name: "" });
    setIsEditingCategory(false);
    setCurrentCategoryId(null);
  };

  const resetSkillForm = () => {
    setSkillForm({ name: "", proficiency: 3 });
    setIsEditingSkill(false);
    setCurrentSkillId(null);
    setCurrentCategoryForSkill(null);
  };

  // Open forms for editing
  const editCategory = (category: SkillCategory) => {
    setIsEditingCategory(true);
    setCurrentCategoryId(category.id || null);
    setCategoryForm({ name: category.name });
    setIsCategoryDialogOpen(true);
  };

  const editSkill = (skill: Skill, categoryId: string) => {
    setIsEditingSkill(true);
    setCurrentSkillId(skill.id || null);
    setCurrentCategoryForSkill(categoryId);
    setSkillForm({ 
      name: skill.name, 
      proficiency: skill.proficiency || 3 
    });
    setIsSkillDialogOpen(true);
  };

  const openAddSkillDialog = (categoryId: string) => {
    resetSkillForm();
    setCurrentCategoryForSkill(categoryId);
    setIsSkillDialogOpen(true);
  };

  // Handle save operations
  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isEditingCategory && currentCategoryId) {
        // Update existing category (would typically call an API)
        setSkillCategories(prev => 
          prev.map(cat => 
            cat.id === currentCategoryId 
              ? { ...cat, name: categoryForm.name } 
              : cat
          )
        );
        
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        // Add new category (would typically call an API)
        const newCategory: SkillCategory = {
          id: Date.now().toString(), // Temporary ID
          name: categoryForm.name,
          skills: []
        };
        
        setSkillCategories(prev => [...prev, newCategory]);
        
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      }
      
      resetCategoryForm();
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSkill = () => {
    if (!skillForm.name.trim() || !currentCategoryForSkill) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const newSkill: Skill = {
        id: isEditingSkill && currentSkillId ? currentSkillId : Date.now().toString(),
        name: skillForm.name,
        proficiency: skillForm.proficiency
      };
      
      if (isEditingSkill && currentSkillId) {
        // Update existing skill
        setSkillCategories(prev => 
          prev.map(cat => {
            if (cat.id === currentCategoryForSkill) {
              return {
                ...cat,
                skills: cat.skills.map(skill => 
                  skill.id === currentSkillId ? newSkill : skill
                )
              };
            }
            return cat;
          })
        );
        
        toast({
          title: "Success",
          description: "Skill updated successfully",
        });
      } else {
        // Add new skill
        setSkillCategories(prev => 
          prev.map(cat => {
            if (cat.id === currentCategoryForSkill) {
              return {
                ...cat,
                skills: [...cat.skills, newSkill]
              };
            }
            return cat;
          })
        );
        
        toast({
          title: "Success",
          description: "Skill added successfully",
        });
      }
      
      resetSkillForm();
      setIsSkillDialogOpen(false);
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete operations
  const handleDeleteCategory = (id: string) => {
    if (!confirm("Are you sure you want to delete this category and all its skills?")) {
      return;
    }
    
    try {
      // Delete category (would typically call an API)
      setSkillCategories(prev => prev.filter(cat => cat.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = (skillId: string, categoryId: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      // Delete skill (would typically call an API)
      setSkillCategories(prev => 
        prev.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              skills: cat.skills.filter(skill => skill.id !== skillId)
            };
          }
          return cat;
        })
      );
      
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  // Render the proficiency level as stars
  const renderProficiency = (level: number = 0) => {
    const maxLevel = 5;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div 
            key={index} 
            className={cn(
              "w-2 h-2 rounded-full",
              index < level ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add your technical and professional skills
          </CardDescription>
        </div>
        <Button 
          onClick={() => {
            resetCategoryForm();
            setIsCategoryDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {skillCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No skill categories added yet</p>
            <p className="text-sm">Add categories to organize your skills</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {skillCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id || ""}>
                <div className="flex items-center justify-between pr-4">
                  <AccordionTrigger className="flex-1">
                    {category.name}
                    <span className="text-muted-foreground text-sm font-normal ml-2">
                      ({category.skills.length})
                    </span>
                  </AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddSkillDialog(category.id || "");
                      }}
                      title="Add skill"
                    >
                      <PlusCircle size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        editCategory(category);
                      }}
                      title="Edit category"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id || "");
                      }}
                      title="Delete category"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <AccordionContent>
                  <div className="pt-2 pb-4">
                    {category.skills.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No skills added to this category</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAddSkillDialog(category.id || "")}
                          className="mt-2"
                        >
                          <Plus size={14} className="mr-1" /> Add Skill
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.skills.map((skill) => (
                          <div 
                            key={skill.id} 
                            className="flex items-center justify-between border rounded-md p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Tag size={16} className="text-muted-foreground" />
                              <span>{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              {renderProficiency(skill.proficiency)}
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => editSkill(skill, category.id || "")}
                                >
                                  <Pencil size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteSkill(skill.id || "", category.id || "")}
                                >
                                  <Trash2 size={14} className="text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
      
      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {isEditingCategory 
                ? "Update the category name" 
                : "Create a new category to group related skills"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name <span className="text-destructive">*</span></Label>
              <Input
                id="categoryName"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryChange}
                placeholder="e.g. Programming Languages"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetCategoryForm();
                setIsCategoryDialogOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditingCategory ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Skill Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {isEditingSkill 
                ? "Update skill details" 
                : "Add a new skill to this category"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name <span className="text-destructive">*</span></Label>
              <Input
                id="skillName"
                name="name"
                value={skillForm.name}
                onChange={handleSkillChange}
                placeholder="e.g. JavaScript"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proficiency">Proficiency Level</Label>
              <div className="flex items-center gap-4">
                <input
                  id="proficiency"
                  name="proficiency"
                  type="range"
                  min="1"
                  max="5"
                  value={skillForm.proficiency}
                  onChange={handleSkillChange}
                  className="w-full"
                />
                <span className="text-sm font-medium min-w-12">
                  {skillForm.proficiency}/5
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground px-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetSkillForm();
                setIsSkillDialogOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSkill} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditingSkill ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 