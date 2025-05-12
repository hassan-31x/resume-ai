"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TemplateCategory } from "@prisma/client";

export type TemplateActionResponse = {
  error?: string;
  success?: string;
};

// Schema for creating/updating a template
const TemplateSchema = z.object({
  id: z.string().optional(),
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
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

// Get all public templates
export async function getPublicTemplates() {
  try {
    const templates = await db.template.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return { templates };
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return { error: "Failed to fetch templates" };
  }
}

// Get template by ID
export async function getTemplateById(id: string) {
  try {
    const template = await db.template.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!template) {
      return { error: "Template not found" };
    }

    return { template };
  } catch (error) {
    console.error("Failed to fetch template:", error);
    return { error: "Failed to fetch template" };
  }
}

// Create a new template
export async function createTemplate(
  values: z.infer<typeof TemplateSchema>
): Promise<TemplateActionResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const validatedFields = TemplateSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { name, description, latexCode, thumbnail, category, tags, isPublic } = validatedFields.data;

    await db.template.create({
      data: {
        name,
        description,
        latexCode,
        thumbnail,
        category: category as TemplateCategory,
        tags: tags || [],
        isPublic,
        isAdminCreated: currentUser.role === "ADMIN",
        userId: currentUser.id,
      },
    });

    revalidatePath("/browse");
    return { success: "Template created successfully" };
  } catch (error) {
    console.error("Failed to create template:", error);
    return { error: "Failed to create template" };
  }
}

// Update an existing template
export async function updateTemplate(
  values: z.infer<typeof TemplateSchema>
): Promise<TemplateActionResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const validatedFields = TemplateSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { id, name, description, latexCode, thumbnail, category, tags, isPublic } = validatedFields.data;

    if (!id) {
      return { error: "Template ID is required" };
    }

    // Check if the template exists and belongs to the user
    const existingTemplate = await db.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return { error: "Template not found" };
    }

    // Only allow the creator or admin to update the template
    if (existingTemplate.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return { error: "You do not have permission to update this template" };
    }

    await db.template.update({
      where: { id },
      data: {
        name,
        description,
        latexCode,
        thumbnail,
        category: category as TemplateCategory,
        tags: tags || existingTemplate.tags,
        isPublic,
      },
    });

    revalidatePath("/browse");
    return { success: "Template updated successfully" };
  } catch (error) {
    console.error("Failed to update template:", error);
    return { error: "Failed to update template" };
  }
}

// Delete a template
export async function deleteTemplate(id: string): Promise<TemplateActionResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    // Check if the template exists and belongs to the user
    const existingTemplate = await db.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return { error: "Template not found" };
    }

    // Only allow the creator or admin to delete the template
    if (existingTemplate.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return { error: "You do not have permission to delete this template" };
    }

    await db.template.delete({
      where: { id },
    });

    revalidatePath("/browse");
    return { success: "Template deleted successfully" };
  } catch (error) {
    console.error("Failed to delete template:", error);
    return { error: "Failed to delete template" };
  }
} 