'use client';

import HtmlDocument from '@/components/html-document';

export default function DemoResumePage() {
  const initialHtml = `<div class="resume">
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
</div>`;

  const initialCss = `.resume {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
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
  color: #4A6CF7;
}

.contact-info {
  margin-top: 5px;
  font-size: 12px;
}

.resume-section {
  margin-bottom: 24px;
}

.resume-section h2 {
  font-size: 18px;
  text-transform: uppercase;
  border-bottom: 1px solid #4A6CF7;
  padding-bottom: 4px;
  margin-bottom: 12px;
  color: #4A6CF7;
}

.resume-item {
  margin-bottom: 12px;
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
  color: #6E82A6;
  font-size: 14px;
}

.date {
  color: #6E82A6;
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
}`;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Resume HTML/CSS Editor</h1>
      <div className="max-w-4xl mx-auto">
        <HtmlDocument initialHtml={initialHtml} initialCss={initialCss} height="h-[900px]" />
      </div>
    </div>
  );
} 