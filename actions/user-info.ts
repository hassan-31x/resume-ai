"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Define type-safe interfaces for our data
interface PersonalInfoData {
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  portfolioUrl?: string | null;
  professionalSummary?: string | null;
  profilePhotoUrl?: string | null;
}

interface WorkExperienceData {
  companyName?: string;
  jobTitle?: string;
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrentJob?: boolean;
  responsibilities?: string[];
  achievements?: string[];
}

interface EducationData {
  schoolName?: string;
  degree?: string;
  fieldOfStudy?: string | null;
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrentlyStudying?: boolean;
  gpa?: string | null;
  achievements?: string[];
  relevantCourses?: string[];
}

interface ProjectData {
  title?: string;
  description?: string;
  projectUrl?: string | null;
  githubUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isOngoing?: boolean;
  technologies?: string[];
  keyPoints?: string[];
}

interface CertificateData {
  name?: string;
  issuingOrganization?: string;
  issueDate?: Date;
  expirationDate?: Date | null;
  neverExpires?: boolean;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

/**
 * Get a user's personal information
 */
export async function getUserPersonalInfo() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", personalInfo: null };
    }
    
    const personalInfo = await db.personalInfo.findUnique({
      where: { userId: session.user.id },
    });
    
    return { error: null, personalInfo };
  } catch (error) {
    console.error("Error getting personal info:", error);
    return { error: "Failed to get personal information", personalInfo: null };
  }
}

/**
 * Update or create a user's personal information
 */
export async function updatePersonalInfo(data: PersonalInfoData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    // Check if user exists
    const user = await getUserById(session.user.id);
    if (!user) {
      return { error: "User not found", success: false };
    }
    
    // Update or create personal info
    await db.personalInfo.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        ...data,
        userId: session.user.id
      },
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error updating personal info:", error);
    return { error: "Failed to update personal information", success: false };
  }
}

/**
 * Get all work experiences for the current user
 */
export async function getUserWorkExperiences() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", workExperiences: [] };
    }
    
    const workExperiences = await db.workExperience.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' },
    });
    
    return { error: null, workExperiences };
  } catch (error) {
    console.error("Error getting work experiences:", error);
    return { error: "Failed to get work experiences", workExperiences: [] };
  }
}

/**
 * Add a new work experience
 */
export async function addWorkExperience(data: WorkExperienceData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    await db.workExperience.create({
      data: {
        ...data,
        userId: session.user.id
      },
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error adding work experience:", error);
    return { error: "Failed to add work experience", success: false };
  }
}

/**
 * Update a work experience
 */
export async function updateWorkExperience(id: string, data: WorkExperienceData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    const existingExperience = await db.workExperience.findUnique({
      where: { id },
    });
    
    if (!existingExperience) {
      return { error: "Work experience not found", success: false };
    }
    
    if (existingExperience.userId !== session.user.id) {
      return { error: "Not authorized to update this work experience", success: false };
    }
    
    await db.workExperience.update({
      where: { id },
      data,
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error updating work experience:", error);
    return { error: "Failed to update work experience", success: false };
  }
}

/**
 * Delete a work experience
 */
export async function deleteWorkExperience(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    const existingExperience = await db.workExperience.findUnique({
      where: { id },
    });
    
    if (!existingExperience) {
      return { error: "Work experience not found", success: false };
    }
    
    if (existingExperience.userId !== session.user.id) {
      return { error: "Not authorized to delete this work experience", success: false };
    }
    
    await db.workExperience.delete({
      where: { id },
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return { error: "Failed to delete work experience", success: false };
  }
}

/**
 * Get all education entries for the current user
 */
export async function getUserEducation() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", education: [] };
    }
    
    const education = await db.education.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'desc' },
    });
    
    return { error: null, education };
  } catch (error) {
    console.error("Error getting education:", error);
    return { error: "Failed to get education entries", education: [] };
  }
}

/**
 * Add a new education entry
 */
export async function addEducation(data: EducationData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    await db.education.create({
      data: {
        ...data,
        userId: session.user.id
      },
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error adding education:", error);
    return { error: "Failed to add education", success: false };
  }
}

/**
 * Update an education entry
 */
export async function updateEducation(id: string, data: EducationData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    const existingEducation = await db.education.findUnique({
      where: { id },
    });
    
    if (!existingEducation) {
      return { error: "Education entry not found", success: false };
    }
    
    if (existingEducation.userId !== session.user.id) {
      return { error: "Not authorized to update this education entry", success: false };
    }
    
    await db.education.update({
      where: { id },
      data,
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error updating education:", error);
    return { error: "Failed to update education", success: false };
  }
}

/**
 * Delete an education entry
 */
export async function deleteEducation(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", success: false };
    }
    
    const existingEducation = await db.education.findUnique({
      where: { id },
    });
    
    if (!existingEducation) {
      return { error: "Education entry not found", success: false };
    }
    
    if (existingEducation.userId !== session.user.id) {
      return { error: "Not authorized to delete this education entry", success: false };
    }
    
    await db.education.delete({
      where: { id },
    });
    
    revalidatePath("/profile");
    return { error: null, success: true };
  } catch (error) {
    console.error("Error deleting education:", error);
    return { error: "Failed to delete education", success: false };
  }
}

/**
 * Get all projects for the current user
 */
export async function getUserProjects() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", projects: [] };
    }
    
    const projects = await db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    return { error: null, projects };
  } catch (error) {
    console.error("Error getting projects:", error);
    return { error: "Failed to get projects", projects: [] };
  }
}

/**
 * Get all skill categories with their skills for the current user
 */
export async function getUserSkills() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", skillCategories: [] };
    }
    
    const skillCategories = await db.skillCategory.findMany({
      where: { userId: session.user.id },
      include: { skills: true },
      orderBy: { createdAt: 'asc' },
    });
    
    return { error: null, skillCategories };
  } catch (error) {
    console.error("Error getting skills:", error);
    return { error: "Failed to get skills", skillCategories: [] };
  }
}

/**
 * Get all certificates for the current user
 */
export async function getUserCertificates() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Unauthorized", certificates: [] };
    }
    
    const certificates = await db.certificate.findMany({
      where: { userId: session.user.id },
      orderBy: { issueDate: 'desc' },
    });
    
    return { error: null, certificates };
  } catch (error) {
    console.error("Error getting certificates:", error);
    return { error: "Failed to get certificates", certificates: [] };
  }
} 