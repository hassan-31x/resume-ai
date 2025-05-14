import { PrismaClient, TemplateCategory } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.id);

  // Templates with HTML and CSS
  const templates = [
    {
      name: "Professional Classic",
      description: "A clean, professional resume template with a traditional layout",
      htmlContent: `<div class="resume">
  <header class="header">
    <h1>John Doe</h1>
    <p class="contact-info">
      123 Main Street, City, State 12345 | (123) 456-7890 | john.doe@email.com | linkedin.com/in/johndoe
    </p>
  </header>
  
  <section class="resume-section">
    <h2>Education</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>University Name</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Bachelor of Science in Computer Science</p>
        <span class="date">Expected Graduation: May 2024</span>
      </div>
      <p>GPA: 3.8/4.0</p>
    </div>
  </section>

  <section class="resume-section">
    <h2>Experience</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Company Name</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Software Engineering Intern</p>
        <span class="date">June 2023 - August 2023</span>
      </div>
      <ul>
        <li>Developed and maintained features for the company's main web application using React and Node.js</li>
        <li>Collaborated with cross-functional teams to implement new features and fix bugs</li>
        <li>Improved application performance by 30% by optimizing database queries</li>
      </ul>
    </div>

    <div class="resume-item">
      <div class="item-header">
        <h3>Another Company</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Technical Assistant</p>
        <span class="date">January 2022 - May 2022</span>
      </div>
      <ul>
        <li>Assisted in troubleshooting technical issues for clients</li>
        <li>Created documentation for internal processes</li>
        <li>Participated in weekly team meetings to discuss progress and roadblocks</li>
      </ul>
    </div>
  </section>

  <section class="resume-section">
    <h2>Projects</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Project Name</h3>
        <span class="location">GitHub: github.com/johndoe/project</span>
      </div>
      <ul>
        <li>Built a web application using React, Node.js, and MongoDB</li>
        <li>Implemented user authentication and authorization</li>
        <li>Deployed the application on AWS</li>
      </ul>
    </div>
  </section>

  <section class="resume-section">
    <h2>Skills</h2>
    <div class="skills-grid">
      <div class="skill-category">
        <h3>Programming Languages:</h3>
        <p>Java, Python, JavaScript, HTML/CSS, SQL</p>
      </div>
      <div class="skill-category">
        <h3>Frameworks & Libraries:</h3>
        <p>React, Node.js, Express, Django</p>
      </div>
      <div class="skill-category">
        <h3>Tools & Technologies:</h3>
        <p>Git, Docker, AWS, MongoDB, PostgreSQL</p>
      </div>
      <div class="skill-category">
        <h3>Soft Skills:</h3>
        <p>Problem Solving, Communication, Teamwork, Leadership</p>
      </div>
    </div>
  </section>
</div>`,
      cssStyles: `.resume {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in;
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: #333;
  background-color: white;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: var(--primary-color);
}

.contact-info {
  margin-top: 5px;
  font-size: 12px;
}

.resume-section {
  margin-bottom: var(--section-spacing);
}

.resume-section h2 {
  font-size: 18px;
  text-transform: uppercase;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 4px;
  margin-bottom: 12px;
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
  font-size: 16px;
  font-weight: bold;
}

.item-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin: 4px 0;
}

.item-subheader p {
  margin: 0;
}

.location {
  color: var(--secondary-color);
  font-size: 14px;
}

.date {
  color: var(--secondary-color);
  font-size: 14px;
}

ul {
  margin: 8px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.skill-category h3 {
  font-size: 14px;
  margin: 0;
  display: inline;
}

.skill-category p {
  display: inline;
  margin-left: 5px;
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
      htmlContent: `<div class="resume">
  <header class="header">
    <h1>Dr. Jane Smith</h1>
    <p class="contact-info">
      Department of Computer Science, University Name<br>
      123 University Ave, City, State 12345<br>
      jane.smith@university.edu | (123) 456-7890 | university.edu/~jsmith
    </p>
  </header>
  
  <section class="resume-section">
    <h2>Education</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>University Name</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Ph.D. in Computer Science</p>
        <span class="date">2015 - 2020</span>
      </div>
      <p>Dissertation: "Title of Dissertation"<br>
      Advisor: Professor Name</p>
    </div>
    
    <div class="resume-item">
      <div class="item-header">
        <h3>Another University</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>M.S. in Computer Science</p>
        <span class="date">2013 - 2015</span>
      </div>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Academic Appointments</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>University Name</h3>
        <span class="location">City, State</span>
      </div>
      <div class="item-subheader">
        <p>Assistant Professor, Department of Computer Science</p>
        <span class="date">2020 - Present</span>
      </div>
      <ul>
        <li>Teaching undergraduate and graduate courses in artificial intelligence and machine learning</li>
        <li>Supervising 3 Ph.D. students and 5 M.S. students</li>
        <li>Leading research projects in natural language processing and computer vision</li>
      </ul>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Research Interests</h2>
    <p>Artificial Intelligence, Machine Learning, Natural Language Processing, Computer Vision</p>
  </section>
  
  <section class="resume-section">
    <h2>Publications</h2>
    <div class="resume-item">
      <h3 class="subsection-title">Journal Articles</h3>
      <ol class="publication-list">
        <li>Smith, J., Johnson, A., et al. (2022). "Title of paper." <em>Journal Name</em>, 10(2), 123-145.</li>
        <li>Smith, J., Williams, B., et al. (2021). "Another paper title." <em>Another Journal</em>, 5(3), 67-89.</li>
      </ol>
    </div>
    
    <div class="resume-item">
      <h3 class="subsection-title">Conference Proceedings</h3>
      <ol class="publication-list">
        <li>Smith, J., Davis, C., et al. (2022). "Conference paper title." In <em>Proceedings of the Conference Name</em>, pp. 234-245.</li>
        <li>Smith, J., Brown, D., et al. (2021). "Another conference paper." In <em>Proceedings of Another Conference</em>, pp. 345-356.</li>
      </ol>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Grants and Funding</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Title of Grant</h3>
        <span class="location">$500,000</span>
      </div>
      <div class="item-subheader">
        <p>Funding Agency</p>
        <span class="date">2021 - 2024</span>
      </div>
      <p>Role: Principal Investigator</p>
    </div>
  </section>
  
  <section class="resume-section">
    <h2>Teaching Experience</h2>
    <div class="resume-item">
      <div class="item-header">
        <h3>Introduction to Artificial Intelligence</h3>
        <span class="date">Fall 2020, Spring 2021, Fall 2021</span>
      </div>
    </div>
    <div class="resume-item">
      <div class="item-header">
        <h3>Advanced Machine Learning</h3>
        <span class="date">Spring 2021, Spring 2022</span>
      </div>
    </div>
    <div class="resume-item">
      <div class="item-header">
        <h3>Natural Language Processing</h3>
        <span class="date">Fall 2020, Fall 2021</span>
      </div>
    </div>
  </section>
</div>`,
      cssStyles: `.resume {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in;
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: #333;
  background-color: white;
}

.header {
  text-align: center;
  margin-bottom: var(--section-spacing);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--primary-color);
}

.contact-info {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.4;
}

.resume-section {
  margin-bottom: var(--section-spacing);
}

.resume-section h2 {
  font-size: 16px;
  text-transform: uppercase;
  color: var(--primary-color);
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 4px;
  margin-bottom: 12px;
  font-weight: bold;
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
  font-size: 15px;
  font-weight: bold;
}

.item-subheader {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  margin: 2px 0 4px 0;
}

.item-subheader p {
  margin: 0;
}

.location {
  color: var(--secondary-color);
  font-size: 14px;
}

.date {
  color: var(--secondary-color);
  font-size: 14px;
}

ul, ol {
  margin: 6px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}

.publication-list {
  padding-left: 22px;
}

.publication-list li {
  margin-bottom: 6px;
}

.subsection-title {
  font-size: 15px;
  font-weight: 600;
  margin: 10px 0 6px 0;
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