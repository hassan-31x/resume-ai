"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { TemplateCategory } from "@prisma/client";
import { z } from "zod";

export type CreateTemplateResponse = {
  success?: boolean;
  error?: string;
  templateId?: string;
};

// Schema for validating template data
const TemplateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  latexCode: z.string().min(1, { message: "LaTeX code is required" }),
  thumbnail: z.string().optional(),
  category: z.enum([
    "PROFESSIONAL", 
    "ACADEMIC", 
    "CREATIVE", 
    "TECHNICAL", 
    "ENTRY_LEVEL", 
    "EXECUTIVE", 
    "OTHER"
  ]),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
});

export type CreateTemplateData = z.infer<typeof TemplateSchema>;

export async function createTemplate(data: CreateTemplateData): Promise<CreateTemplateResponse> {
  try {
    // Validate the template data
    const validatedData = TemplateSchema.safeParse(data);
    
    if (!validatedData.success) {
      return {
        error: "Invalid template data. Please check your input.",
      };
    }
    
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        error: "You must be logged in to create a template.",
      };
    }
    
    // Create the template
    const template = await db.template.create({
      data: {
        name: validatedData.data.name,
        description: validatedData.data.description,
        latexCode: validatedData.data.latexCode,
        thumbnail: validatedData.data.thumbnail,
        category: validatedData.data.category as TemplateCategory,
        tags: validatedData.data.tags,
        isPublic: validatedData.data.isPublic,
        isAdminCreated: user.role === "ADMIN",
        userId: user.id,
      },
    });
    
    // Revalidate relevant pages
    revalidatePath("/browse");
    revalidatePath("/templates");
    
    return {
      success: true,
      templateId: template.id,
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return {
      error: "Failed to create template. Please try again later.",
    };
  }
} 