import { Template } from "@prisma/client";

/**
 * Replace all variables in a template string with values from data object
 * Variables are in the format {{variableName}}
 */
export function replaceVariables(template: string, data: any): string {
  // Handle basic variable replacement {{variable}}
  let result = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const value = getNestedValue(data, key);
    return value !== undefined ? value : match;
  });
  
  // Handle array iteration with {{#array}} {{.}} {{/array}}
  result = result.replace(/\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const array = getNestedValue(data, key);
    if (!Array.isArray(array)) return "";
    
    return array.map(item => {
      // Replace {{.}} with the current item if it's a primitive
      if (typeof item !== 'object' || item === null) {
        return content.replace(/\{\{\.\}\}/g, item);
      }
      
      // Otherwise, do nested replacement for object items
      return content.replace(/\{\{([^}]+)\}\}/g, (m: string, itemKey: string) => {
        if (itemKey === '.') return item;
        return item[itemKey] !== undefined ? item[itemKey] : m;
      });
    }).join('');
  });
  
  return result;
}

/**
 * Get a nested value from an object using dot notation
 * e.g. getNestedValue(obj, "user.name") => obj.user.name
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

/**
 * Get CSS variable definitions based on template styling properties
 */
function getCssVariables(template: Template): string {
  return `
  <style>
    :root {
      --primary-color: ${template.primaryColor};
      --secondary-color: ${template.secondaryColor};
      --font-family: ${template.fontFamily};
      --font-size: ${template.fontSize}px;
      --line-height: ${template.lineHeight};
      --section-spacing: ${template.sectionSpacing}px;
      --item-spacing: ${template.itemSpacing}px;
    }
  </style>
  `;
}

/**
 * Assemble a complete HTML resume from template components and data
 */
export function assembleTemplate(template: Template, data: any): string {
  // Start with a basic document structure and CSS variables
  let html = '<div class="resume">';
  
  // Add CSS variables
  html += getCssVariables(template);
  
  // Add header and contact info
  html += replaceVariables(template.headerHTML, data);
  html += replaceVariables(template.contactHTML, data);
  
  // Add education section if there's data
  if (data.education && data.education.length > 0) {
    html += replaceVariables(template.educationTitleHTML, data);
    data.education.forEach((edu: any) => {
      html += replaceVariables(template.educationItemHTML, edu);
    });
    html += '</section>';
  }
  
  // Add experience section if there's data
  if (data.experience && data.experience.length > 0) {
    html += replaceVariables(template.experienceTitleHTML, data);
    data.experience.forEach((exp: any) => {
      html += replaceVariables(template.experienceItemHTML, exp);
    });
    html += '</section>';
  }
  
  // Add skills section if there's data
  if (data.skills) {
    html += replaceVariables(template.skillsTitleHTML, data);
    html += replaceVariables(template.skillsItemHTML, data.skills);
    html += '</section>';
  }
  
  // Add projects section if there's data and template has project sections
  if (data.projects && data.projects.length > 0 && template.projectsTitleHTML && template.projectsItemHTML) {
    html += replaceVariables(template.projectsTitleHTML, data);
    data.projects.forEach((proj: any) => {
      // Only use projectsItemHTML if it's not null
      if (template.projectsItemHTML) {
        html += replaceVariables(template.projectsItemHTML, proj);
      }
    });
    html += '</section>';
  }
  
  // Close the resume div
  html += '</div>';
  
  return html;
} 