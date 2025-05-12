"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Template categories from the Prisma schema
const categories = [
  { label: "Professional", value: "PROFESSIONAL" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Creative", value: "CREATIVE" },
  { label: "Technical", value: "TECHNICAL" },
  { label: "Entry Level", value: "ENTRY_LEVEL" },
  { label: "Executive", value: "EXECUTIVE" },
  { label: "Other", value: "OTHER" },
];

// Common job fields/industries for tagging templates
const commonTags = [
  "Engineering",
  "IT",
  "Software",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
  "Education",
  "Management",
  "Research",
  "Science",
  "Business",
  "Media",
  "Law",
  "Minimal",
  "Modern",
  "Classic",
  "Bold",
  "Elegant",
];

export default function TemplateFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  // Parse current search params
  const currentCategory = searchParams.get("category");
  const currentTags = searchParams.get("tags")?.split(",") || [];
  
  // Create query string with updated parameters
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    for (const [key, value] of Object.entries(params)) {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }
    
    return newSearchParams.toString();
  };
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setCategoryOpen(false);
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ category: value })}`);
    });
  };
  
  // Handle tag selection
  const handleTagChange = (tag: string, checked: boolean) => {
    let newTags: string[];
    
    if (checked) {
      newTags = [...currentTags, tag];
    } else {
      newTags = currentTags.filter(t => t !== tag);
    }
    
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ 
        tags: newTags.length > 0 ? newTags.join(",") : null 
      })}`);
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };
  
  const hasActiveFilters = currentCategory || currentTags.length > 0;
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            disabled={isPending}
            className="h-8 px-2 text-xs"
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Category filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Category</p>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-full justify-between"
                disabled={isPending}
              >
                {currentCategory
                  ? categories.find(category => category.value === currentCategory)?.label
                  : "Select category"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.value}
                      value={category.value}
                      onSelect={() => handleCategoryChange(category.value)}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentCategory === category.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tags filter */}
        <Accordion type="single" collapsible defaultValue="tags">
          <AccordionItem value="tags" className="border-none">
            <AccordionTrigger className="py-2">
              <span className="text-sm font-medium">Popular Tags</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {commonTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={currentTags.includes(tag)}
                      onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                      disabled={isPending}
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
} 