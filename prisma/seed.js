import { PrismaClient, TemplateCategory } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("muhammadhassan.gtsolutionsusa@gmail.com", 12);
  const admin = await prisma.user.upsert({
    where: { email: "muhammadhassan.gtsolutionsusa@gmail.com" },
    update: {},
    create: {
      email: "muhammadhassan.gtsolutionsusa@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.id);

  // Templates with component-based HTML and CSS
  const templates = [
    {
      name: "Professional Classic",
      description: "A clean, professional resume template with a traditional layout",
      
      // Component-based HTML structure
      headerHTML: `<header class="header">
  <h1>{{fullName}}</h1>
  <p class="contact-info">{{jobTitle}}</p>
</header>`,
      
      contactHTML: `<p class="contact-info">
  {{location}} | {{phone}} | {{email}} | {{linkedin}}
</p>`,
      
      educationTitleHTML: `<section class="resume-section">
  <h2>Education</h2>`,
      
      educationItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{school}}</h3>
    <span class="location">{{location}}</span>
  </div>
  <div class="item-subheader">
    <p>{{degree}}</p>
    <span class="date">{{startDate}} - {{endDate}}</span>
  </div>
  <p>GPA: {{gpa}}</p>
</div>`,
      
      experienceTitleHTML: `<section class="resume-section">
  <h2>Experience</h2>`,
      
      experienceItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{title}}</h3>
    <span class="location">{{company}}, {{location}}</span>
  </div>
  <div class="item-subheader">
    <p></p>
    <span class="date">{{startDate}} - {{endDate}}</span>
  </div>
  <ul>
    {{#responsibilities}}
    <li>{{.}}</li>
    {{/responsibilities}}
  </ul>
</div>`,
      
      skillsTitleHTML: `<section class="resume-section">
  <h2>Skills</h2>`,
      
      skillsItemHTML: `<div class="skills-grid">
  <div class="skill-category">
    <h3>Languages:</h3>
    <p>{{languages}}</p>
  </div>
  <div class="skill-category">
    <h3>Frameworks:</h3>
    <p>{{frameworks}}</p>
  </div>
  <div class="skill-category">
    <h3>Databases:</h3>
    <p>{{databases}}</p>
  </div>
  <div class="skill-category">
    <h3>Tools:</h3>
    <p>{{tools}}</p>
  </div>
</div>`,
      
      projectsTitleHTML: `<section class="resume-section">
  <h2>Projects</h2>`,
      
      projectsItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{title}}</h3>
    <span class="location">{{link}}</span>
  </div>
  <p>{{description}}</p>
  <ul>
    {{#points}}
    <li>{{.}}</li>
    {{/points}}
  </ul>
</div>`,
      
      cssStyles: `.resume {
  max-width: 100%;
  margin: 0 auto;
  padding: 5%;
  font-family: var(--font-family);
  font-size: 1em;
  line-height: var(--line-height);
  color: #333;
  background-color: white;
}

.header {
  text-align: center;
  margin-bottom: 1.5em;
}

.header h1 {
  margin: 0;
  font-size: 1.8em;
  color: var(--primary-color);
}

.contact-info {
  margin-top: 0.4em;
  font-size: 0.85em;
}

.resume-section {
  margin-bottom: var(--section-spacing);
}

.resume-section h2 {
  font-size: 1.2em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
  color: var(--primary-color);
}

.resume-item {
  margin-bottom: var(--item-spacing);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.item-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin: 0.3em 0;
}

.item-subheader p {
  margin: 0;
}

.location {
  color: var(--secondary-color);
  font-size: 0.9em;
}

.date {
  color: var(--secondary-color);
  font-size: 0.9em;
}

ul {
  margin: 0.6em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.3em;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
}

.skill-category h3 {
  font-size: 0.95em;
  margin: 0;
  display: inline;
}

.skill-category p {
  display: inline;
  margin-left: 0.3em;
}`,
      category: TemplateCategory.PROFESSIONAL,
      tags: ["Modern", "Classic", "Software", "Engineering"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
      primaryColor: "#4A6CF7", 
      secondaryColor: "#6E82A6",
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
      sectionSpacing: 24,
      itemSpacing: 12
    },
    {
      name: "Academic CV",
      description: "A comprehensive academic CV template for researchers and professors",
      
      // Component-based HTML structure
      headerHTML: `<header class="header">
  <h1>{{fullName}}</h1>
  <p class="contact-info">{{jobTitle}}</p>
</header>`,
      
      contactHTML: `<p class="contact-info">
  Department of Computer Science, University Name<br>
  {{location}} | {{phone}} | {{email}} | {{website}}
</p>`,
      
      educationTitleHTML: `<section class="resume-section">
  <h2>Education</h2>`,
      
      educationItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{school}}</h3>
    <span class="location">{{location}}</span>
  </div>
  <div class="item-subheader">
    <p>{{degree}}</p>
    <span class="date">{{startDate}} - {{endDate}}</span>
  </div>
  <p>Dissertation: "Title of Dissertation"<br>
  Advisor: Professor Name</p>
</div>`,
      
      experienceTitleHTML: `<section class="resume-section">
  <h2>Academic Appointments</h2>`,
      
      experienceItemHTML: `<div class="resume-item">
  <div class="item-header">
    <h3>{{title}}</h3>
    <span class="location">{{company}}, {{location}}</span>
  </div>
  <div class="item-subheader">
    <p></p>
    <span class="date">{{startDate}} - {{endDate}}</span>
  </div>
  <ul>
    {{#responsibilities}}
    <li>{{.}}</li>
    {{/responsibilities}}
  </ul>
</div>`,
      
      skillsTitleHTML: `<section class="resume-section">
  <h2>Research Interests</h2>`,
      
      skillsItemHTML: `<p>{{technical}}</p>`,
      
      projectsTitleHTML: `<section class="resume-section">
  <h2>Publications</h2>`,
      
      projectsItemHTML: `<div class="resume-item">
  <h3 class="subsection-title">Journal Articles</h3>
  <ol class="publication-list">
    <li>{{fullName}}, et al. (2022). "{{title}}." <em>Journal Name</em>, 10(2), 123-145.</li>
    <li>{{fullName}}, et al. (2021). "Another paper title." <em>Another Journal</em>, 5(3), 67-89.</li>
  </ol>
</div>`,
      
      cssStyles: `.resume {
  max-width: 100%;
  margin: 0 auto;
  padding: 5%;
  font-family: var(--font-family);
  font-size: 1em;
  line-height: var(--line-height);
  color: #333;
  background-color: white;
}

.header {
  text-align: center;
  margin-bottom: 1.5em;
}

.header h1 {
  margin: 0;
  font-size: 1.8em;
  color: var(--primary-color);
}

.contact-info {
  margin-top: 0.4em;
  font-size: 0.85em;
}

.resume-section {
  margin-bottom: var(--section-spacing);
}

.resume-section h2 {
  font-size: 1.2em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
  color: var(--primary-color);
}

.resume-item {
  margin-bottom: var(--item-spacing);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.item-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin: 0.3em 0;
}

.item-subheader p {
  margin: 0;
}

.location {
  color: var(--secondary-color);
  font-size: 0.9em;
}

.date {
  color: var(--secondary-color);
  font-size: 0.9em;
}

ul, ol {
  margin: 0.6em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.3em;
}

.publication-list {
  padding-left: 1.7em;
}

.publication-list li {
  margin-bottom: 0.4em;
}

.subsection-title {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.8em 0 0.4em 0;
  color: var(--secondary-color);
}

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}`,
      category: TemplateCategory.ACADEMIC,
      tags: ["Academic", "Research", "Professor", "PhD"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop",
      primaryColor: "#00407e",
      secondaryColor: "#666666",
      fontFamily: "'Georgia', serif",
      fontSize: 14,
      lineHeight: 1.5,
      sectionSpacing: 22,
      itemSpacing: 12
    }
  ];

  // Insert templates
  for (const template of templates) {
    await prisma.template.create({
      data: template,
    });
  }

  console.log(`Created ${templates.length} templates`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 