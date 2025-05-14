"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TemplateCategory } from "@prisma/client";
import { isValidObjectId } from "@/lib/mongodb-utils";

export type TemplateActionResponse = {
  error?: string;
  success?: string;
};

// Schema for creating/updating a template
const TemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  htmlContent: z.string().min(1, { message: "HTML content is required" }),
  cssStyles: z.string().min(1, { message: "CSS styles are required" }),
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
        htmlContent: {
          not: ""
        }
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
    
    // Filter out any templates that might have null htmlContent
    const validTemplates = templates.filter(template => 
      template.htmlContent !== null && template.htmlContent !== undefined
    );
    
    return { templates: validTemplates };
  } catch (error) {
    console.error("Error fetching public templates:", error);
    return { 
      templates: null,
      error: "Failed to fetch templates. Please try again." 
    };
  }
}

// Get template by ID
export async function getTemplateById(id: string) {
  try {
    if (!isValidObjectId(id)) {
      return { 
        template: null,
        error: "Invalid template ID" 
      };
    }
    
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
      return { 
        template: null, 
        error: "Template not found" 
      };
    }
    
    // Check if template has valid HTML content
    if (!template.htmlContent) {
      return {
        template: null,
        error: "This template is no longer supported. It may have been created with an older version of the application."
      };
    }
    
    return { template };
  } catch (error) {
    console.error("Error fetching template:", error);
    return { 
      template: null,
      error: "Failed to fetch template. Please try again." 
    };
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

    const { name, description, htmlContent, cssStyles, thumbnail, category, tags, isPublic } = validatedFields.data;

    await db.template.create({
      data: {
        name,
        description,
        htmlContent,
        cssStyles,
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

    const { id, name, description, htmlContent, cssStyles, thumbnail, category, tags, isPublic } = validatedFields.data;

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
        htmlContent,
        cssStyles,
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

// Get templates created by a user
export async function getUserTemplates(userId: string) {
  try {
    const templates = await db.template.findMany({
      where: {
        userId,
        htmlContent: {
          not: ""
        }
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
    })
    .then(templates => templates.filter(template => template.htmlContent !== null && template.htmlContent !== ""));

    return { templates };
  } catch (error) {
    console.error("Error fetching user templates:", error);
    return {
      templates: [],
      error: "Failed to fetch templates. Please try again.",
    };
  }
}

// Get templates created by admins
export async function getAdminTemplates() {
  try {
    const templates = await db.template.findMany({
      where: {
        isAdminCreated: true,
        htmlContent: {
          not: ""
        }
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
    })
    .then(templates => templates.filter(template => template.htmlContent !== null && template.htmlContent !== ""));

    return { templates };
  } catch (error) {
    console.error("Error fetching admin templates:", error);
    return {
      templates: [],
      error: "Failed to fetch templates. Please try again.",
    };
  }
}

// Get templates by category
export async function getTemplatesByCategoryId(category: TemplateCategory) {
  try {
    const templates = await db.template.findMany({
      where: {
        category,
        htmlContent: {
          not: ""
        }
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
    })
    .then(templates => templates.filter(template => template.htmlContent !== null && template.htmlContent !== ""));

    return { templates };
  } catch (error) {
    console.error("Error fetching templates by category:", error);
    return {
      templates: [],
      error: "Failed to fetch templates. Please try again.",
    };
  }
} 