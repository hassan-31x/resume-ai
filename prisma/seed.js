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

  // Simple LaTeX resume template examples
  const templates = [
    {
      name: "Professional Classic",
      description: "A clean, professional resume template with a traditional layout",
      latexCode: `\\documentclass[a4paper,11pt]{article}
      
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\geometry{margin=1in}
\\pagestyle{empty}

% Define colors
\\definecolor{primary}{RGB}{70, 70, 70}
\\definecolor{secondary}{RGB}{120, 120, 120}
\\definecolor{accent}{RGB}{50, 50, 50}

% Format section titles
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{\\titlerule\\vspace{0.5em}}

\\begin{document}

\\begin{center}
    {\\Huge\\textbf{JOHN DOE}}\\\\
    123 Main Street, City, State 12345 \\\\
    \\href{mailto:john.doe@email.com}{john.doe@email.com} $|$ (123) 456-7890 $|$ 
    \\href{https://linkedin.com/in/johndoe}{linkedin.com/in/johndoe}
\\end{center}

\\section{EDUCATION}
\\textbf{University Name} \\hfill City, State\\\\
Bachelor of Science in Computer Science \\hfill Expected Graduation: May 2024\\\\
GPA: 3.8/4.0

\\section{EXPERIENCE}
\\textbf{Company Name} \\hfill City, State\\\\
\\textit{Software Engineering Intern} \\hfill June 2023 - August 2023
\\begin{itemize}[leftmargin=*]
    \\item Developed and maintained features for the company's main web application using React and Node.js
    \\item Collaborated with cross-functional teams to implement new features and fix bugs
    \\item Improved application performance by 30\\% by optimizing database queries
\\end{itemize}

\\textbf{Another Company} \\hfill City, State\\\\
\\textit{Technical Assistant} \\hfill January 2022 - May 2022
\\begin{itemize}[leftmargin=*]
    \\item Assisted in troubleshooting technical issues for clients
    \\item Created documentation for internal processes
    \\item Participated in weekly team meetings to discuss progress and roadblocks
\\end{itemize}

\\section{PROJECTS}
\\textbf{Project Name} \\hfill \\textit{GitHub: \\href{https://github.com/johndoe/project}{github.com/johndoe/project}}
\\begin{itemize}[leftmargin=*]
    \\item Built a web application using React, Node.js, and MongoDB
    \\item Implemented user authentication and authorization
    \\item Deployed the application on AWS
\\end{itemize}

\\section{SKILLS}
\\textbf{Programming Languages:} Java, Python, JavaScript, HTML/CSS, SQL\\\\
\\textbf{Frameworks \& Libraries:} React, Node.js, Express, Django\\\\
\\textbf{Tools \& Technologies:} Git, Docker, AWS, MongoDB, PostgreSQL\\\\
\\textbf{Soft Skills:} Problem Solving, Communication, Teamwork, Leadership

\\end{document}`,
      category: TemplateCategory.PROFESSIONAL,
      tags: ["Modern", "Classic", "Software", "Engineering"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Academic CV",
      description: "A comprehensive academic CV template for researchers and professors",
      latexCode: `\\documentclass[11pt,a4paper]{article}

\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\geometry{margin=1in}
\\pagestyle{empty}

% Define colors
\\definecolor{primary}{RGB}{0, 60, 113}
\\definecolor{secondary}{RGB}{102, 102, 102}

% Format section titles
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{\\vspace{0.2em}}
\\titleformat{\\subsection}{\\large\\bfseries\\color{secondary}}{}{0em}{\\vspace{0.1em}}

\\begin{document}

\\begin{center}
    {\\LARGE\\textbf{DR. JANE SMITH}}\\\\
    \\vspace{0.5em}
    Department of Computer Science, University Name\\\\
    123 University Ave, City, State 12345\\\\
    \\vspace{0.3em}
    \\href{mailto:jane.smith@university.edu}{jane.smith@university.edu} $|$ (123) 456-7890 $|$ 
    \\href{https://university.edu/~jsmith}{university.edu/~jsmith}
\\end{center}

\\section{EDUCATION}
\\textbf{University Name} \\hfill City, State\\\\
Ph.D. in Computer Science \\hfill 2015 - 2020\\\\
Dissertation: "Title of Dissertation"\\\\
Advisor: Professor Name

\\textbf{Another University} \\hfill City, State\\\\
M.S. in Computer Science \\hfill 2013 - 2015

\\section{ACADEMIC APPOINTMENTS}
\\textbf{University Name} \\hfill City, State\\\\
Assistant Professor, Department of Computer Science \\hfill 2020 - Present
\\begin{itemize}[leftmargin=*]
    \\item Teaching undergraduate and graduate courses in artificial intelligence and machine learning
    \\item Supervising 3 Ph.D. students and 5 M.S. students
    \\item Leading research projects in natural language processing and computer vision
\\end{itemize}

\\section{RESEARCH INTERESTS}
Artificial Intelligence, Machine Learning, Natural Language Processing, Computer Vision

\\section{PUBLICATIONS}
\\subsection{Journal Articles}
\\begin{enumerate}[leftmargin=*]
    \\item Smith, J., Johnson, A., et al. (2022). "Title of paper." \\textit{Journal Name}, 10(2), 123-145.
    \\item Smith, J., Williams, B., et al. (2021). "Another paper title." \\textit{Another Journal}, 5(3), 67-89.
\\end{enumerate}

\\subsection{Conference Proceedings}
\\begin{enumerate}[leftmargin=*]
    \\item Smith, J., Davis, C., et al. (2022). "Conference paper title." In \\textit{Proceedings of the Conference Name}, pp. 234-245.
    \\item Smith, J., Brown, D., et al. (2021). "Another conference paper." In \\textit{Proceedings of Another Conference}, pp. 345-356.
\\end{enumerate}

\\section{GRANTS AND FUNDING}
\\textbf{Title of Grant} \\hfill \\$500,000\\\\
Funding Agency \\hfill 2021 - 2024\\\\
Role: Principal Investigator

\\section{TEACHING EXPERIENCE}
\\textbf{Introduction to Artificial Intelligence} \\hfill Fall 2020, Spring 2021, Fall 2021\\\\
\\textbf{Advanced Machine Learning} \\hfill Spring 2021, Spring 2022\\\\
\\textbf{Natural Language Processing} \\hfill Fall 2020, Fall 2021

\\section{PROFESSIONAL SERVICE}
\\textbf{Reviewer} for Journal Name, Another Journal\\\\
\\textbf{Program Committee Member} for Conference Name, Another Conference\\\\
\\textbf{Workshop Organizer} for Workshop Name, 2022

\\end{document}`,
      category: TemplateCategory.ACADEMIC,
      tags: ["Academic", "Research", "Professor", "PhD"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Creative Design Resume",
      description: "A modern, creative resume template for designers and artists",
      latexCode: `\\documentclass[a4paper,10pt]{article}

\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\geometry{margin=0.8in}
\\pagestyle{empty}

% Define colors
\\definecolor{primary}{RGB}{26, 188, 156}
\\definecolor{secondary}{RGB}{44, 62, 80}
\\definecolor{accent}{RGB}{52, 152, 219}

% Format section titles
\\titleformat{\\section}{\\normalfont\\Large\\bfseries\\color{primary}}{}{0em}{\\vspace{0.2em}}

\\begin{document}

% Header with name and title
\\begin{tikzpicture}[remember picture, overlay]
  \\fill[color=primary] (current page.north west) rectangle ++({\\paperwidth},1.5cm);
  \\node[anchor=west, text=white, font=\\Huge\\bfseries, xshift=1cm, yshift=-0.75cm] at (current page.north west) {ALEX RIVERA};
  \\node[anchor=east, text=white, font=\\large, xshift=-1cm, yshift=-0.75cm] at (current page.north east) {GRAPHIC DESIGNER};
\\end{tikzpicture}

\\vspace*{1.7cm}

% Contact information
\\begin{minipage}{0.5\\textwidth}
  \\faEnvelope\\ \\href{mailto:alex.rivera@email.com}{alex.rivera@email.com}\\\\
  \\faPhone\\ (123) 456-7890
\\end{minipage}
\\begin{minipage}{0.5\\textwidth}
  \\faLinkedin\\ \\href{https://linkedin.com/in/alexrivera}{linkedin.com/in/alexrivera}\\\\
  \\faGlobe\\ \\href{https://alexrivera.com}{alexrivera.com}
\\end{minipage}

\\vspace{0.5cm}

% Profile section
\\section{PROFILE}
Creative and detail-oriented graphic designer with 5+ years of experience creating visually stunning designs for print and digital media. Proficient in Adobe Creative Suite with a strong portfolio of branding, packaging, and UI/UX design projects.

% Skills section
\\section{SKILLS}
\\begin{minipage}{0.33\\textwidth}
  \\textbf{Design}
  \\begin{itemize}[leftmargin=*]
    \\item Branding
    \\item Typography
    \\item Illustration
    \\item Layout Design
  \\end{itemize}
\\end{minipage}
\\begin{minipage}{0.33\\textwidth}
  \\textbf{Software}
  \\begin{itemize}[leftmargin=*]
    \\item Adobe Photoshop
    \\item Adobe Illustrator
    \\item Adobe InDesign
    \\item Figma
  \\end{itemize}
\\end{minipage}
\\begin{minipage}{0.33\\textwidth}
  \\textbf{Other}
  \\begin{itemize}[leftmargin=*]
    \\item HTML/CSS
    \\item UI/UX Design
    \\item Project Management
    \\item Client Communication
  \\end{itemize}
\\end{minipage}

\\vspace{0.5cm}

% Experience section
\\section{EXPERIENCE}
\\textbf{Creative Agency Name} \\hfill City, State\\\\
\\textit{Senior Graphic Designer} \\hfill Jan 2020 - Present
\\begin{itemize}[leftmargin=*]
  \\item Led branding projects for 10+ clients, including logo design, style guides, and marketing materials
  \\item Collaborated with the web development team to create cohesive UI designs for client websites
  \\item Mentored junior designers and provided feedback during weekly design reviews
  \\item Increased client satisfaction ratings by 25\\% through improved design processes
\\end{itemize}

\\textbf{Design Studio Name} \\hfill City, State\\\\
\\textit{Graphic Designer} \\hfill Jun 2017 - Dec 2019
\\begin{itemize}[leftmargin=*]
  \\item Created packaging designs for consumer products in the food and beverage industry
  \\item Developed social media graphics and campaigns for various clients
  \\item Assisted with photo shoots and edited product photography
\\end{itemize}

% Education section
\\section{EDUCATION}
\\textbf{University Name} \\hfill City, State\\\\
Bachelor of Fine Arts in Graphic Design \\hfill Graduated: May 2017\\\\
GPA: 3.75/4.0

% Portfolio highlights
\\section{PORTFOLIO HIGHLIGHTS}
\\begin{itemize}[leftmargin=*]
  \\item \\textbf{Brand Redesign:} Complete rebranding for a local coffee shop, resulting in 35\\% increased foot traffic
  \\item \\textbf{Packaging Design:} Award-winning packaging design for an organic skincare line
  \\item \\textbf{Website Design:} UI/UX design for an e-commerce platform with improved conversion rates
  \\item \\textbf{App Interface:} Mobile app interface design for a fitness tracking application
\\end{itemize}

% Footer
\\begin{tikzpicture}[remember picture, overlay]
  \\fill[color=primary] (current page.south west) rectangle ++({\\paperwidth},0.5cm);
\\end{tikzpicture}

\\end{document}`,
      category: TemplateCategory.CREATIVE,
      tags: ["Creative", "Design", "Graphic Design", "Modern"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1611702700098-dec597b27d9d?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Technical Resume",
      description: "A technical resume template for software developers and engineers",
      latexCode: `\\documentclass[11pt,a4paper]{article}

\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\geometry{margin=0.75in}
\\pagestyle{empty}

% Define colors
\\definecolor{primary}{RGB}{61, 90, 128}
\\definecolor{secondary}{RGB}{152, 193, 217}
\\definecolor{background}{RGB}{238, 244, 249}

% Format section titles
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{\\titlerule[1pt]\\vspace{0.5em}}

\\begin{document}
\\pagecolor{background}

\\begin{center}
    {\\Huge\\textbf{\\textcolor{primary}{TAYLOR PARKER}}}\\\\
    \\vspace{0.5em}
    \\texttt{\\href{mailto:taylor.parker@email.com}{taylor.parker@email.com}} $|$ 
    (123) 456-7890 $|$ 
    \\texttt{\\href{https://github.com/tparker}{github.com/tparker}} $|$
    \\texttt{\\href{https://linkedin.com/in/taylorparker}{linkedin.com/in/taylorparker}}
\\end{center}

\\section{TECHNICAL SKILLS}
\\begin{itemize}[leftmargin=*, itemsep=0pt]
    \\item \\textbf{Languages:} Python, JavaScript, Java, C++, SQL, HTML/CSS, TypeScript, Bash
    \\item \\textbf{Frameworks:} React, Node.js, Django, Express, Spring Boot, TensorFlow
    \\item \\textbf{Tools:} Git, Docker, Kubernetes, AWS, GCP, CI/CD, Jenkins, Webpack
    \\item \\textbf{Databases:} PostgreSQL, MongoDB, Redis, MySQL, ElasticSearch
    \\item \\textbf{Methodologies:} Agile/Scrum, Test-Driven Development, Microservices Architecture
\\end{itemize}

\\section{WORK EXPERIENCE}
\\textbf{Tech Company Name} \\hfill City, State\\\\
\\textit{Senior Software Engineer} \\hfill Jan 2021 - Present
\\begin{itemize}[leftmargin=*, itemsep=1pt]
    \\item Designed and implemented a microservices architecture that improved system reliability by 99.9\\%
    \\item Led a team of 5 engineers in developing a new feature used by 50,000+ daily active users
    \\item Optimized database queries that reduced API response time by 40\\%
    \\item Implemented CI/CD pipeline with automated testing that reduced deployment time by 70\\%
    \\item Conducted code reviews and mentored junior developers on best practices
\\end{itemize}

\\textbf{Another Tech Company} \\hfill City, State\\\\
\\textit{Software Engineer} \\hfill Jun 2018 - Dec 2020
\\begin{itemize}[leftmargin=*, itemsep=1pt]
    \\item Developed RESTful APIs using Node.js and Express for customer-facing applications
    \\item Created responsive front-end components with React and TypeScript
    \\item Collaborated with UX designers to implement user interface improvements
    \\item Participated in agile development cycles, including daily standups and sprint planning
    \\item Built and maintained automated test suites with Jest and Cypress
\\end{itemize}

\\textbf{Startup Name} \\hfill City, State\\\\
\\textit{Junior Developer} \\hfill Aug 2016 - May 2018
\\begin{itemize}[leftmargin=*, itemsep=1pt]
    \\item Assisted in building a web application using Django and PostgreSQL
    \\item Implemented user authentication and authorization features
    \\item Fixed bugs and addressed technical debt in legacy codebase
\\end{itemize}

\\section{PROJECTS}
\\textbf{Open Source Contribution} \\hfill \\texttt{\\href{https://github.com/project/repo}{github.com/project/repo}}
\\begin{itemize}[leftmargin=*, itemsep=1pt]
    \\item Contributed to a popular open-source library with 5,000+ stars on GitHub
    \\item Implemented new features and fixed critical bugs
    \\item Collaborated with maintainers to improve documentation
\\end{itemize}

\\textbf{Personal Project} \\hfill \\texttt{\\href{https://myproject.com}{myproject.com}}
\\begin{itemize}[leftmargin=*, itemsep=1pt]
    \\item Built a full-stack web application using React, Node.js, and MongoDB
    \\item Implemented OAuth authentication and role-based access control
    \\item Deployed to AWS using containerization with Docker and Kubernetes
\\end{itemize}

\\section{EDUCATION}
\\textbf{University Name} \\hfill City, State\\\\
Bachelor of Science in Computer Science \\hfill Graduated: May 2016\\\\
GPA: 3.7/4.0 $|$ Dean's List: 6 semesters $|$ Relevant Coursework: Data Structures, Algorithms, Database Systems

\\section{CERTIFICATIONS}
\\textbf{AWS Certified Solutions Architect} \\hfill Issued: Jan 2022\\\\
\\textbf{Google Cloud Professional Data Engineer} \\hfill Issued: Mar 2021\\\\
\\textbf{MongoDB Certified Developer} \\hfill Issued: Nov 2020

\\end{document}`,
      category: TemplateCategory.TECHNICAL,
      tags: ["Technical", "Software", "Engineering", "Developer"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Entry Level Resume",
      description: "A clean and professional resume template for students and recent graduates",
      latexCode: `\\documentclass[letterpaper,11pt]{article}

\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\geometry{margin=0.75in}
\\pagestyle{empty}

% Define colors
\\definecolor{primary}{RGB}{70, 130, 180}
\\definecolor{secondary}{RGB}{128, 128, 128}

% Format section titles
\\titleformat{\\section}{\\normalfont\\Large\\bfseries\\color{primary}}{}{0em}{\\vspace{0.2em}}

\\begin{document}

\\begin{center}
    {\\LARGE\\textbf{JAMIE WILSON}}\\\\
    \\vspace{0.3em}
    123 College Ave, City, State 12345 $|$ (123) 456-7890\\\\
    \\href{mailto:jamie.wilson@email.com}{jamie.wilson@email.com} $|$ 
    \\href{https://linkedin.com/in/jamiewilson}{linkedin.com/in/jamiewilson}
\\end{center}

\\section{EDUCATION}
\\textbf{University Name} \\hfill City, State\\\\
Bachelor of Business Administration, Marketing \\hfill Expected Graduation: May 2023\\\\
GPA: 3.6/4.0 $|$ Dean's List: Fall 2021, Spring 2022

\\textbf{Relevant Coursework:}
Marketing Research, Consumer Behavior, Digital Marketing, Business Communication, Social Media Marketing

\\section{EXPERIENCE}
\\textbf{Marketing Agency Name} \\hfill City, State\\\\
\\textit{Marketing Intern} \\hfill May 2022 - August 2022
\\begin{itemize}[leftmargin=*]
    \\item Assisted in developing social media content for 5 clients across different industries
    \\item Conducted competitor analysis and presented findings to the marketing team
    \\item Created weekly analytics reports tracking campaign performance
    \\item Collaborated with graphic designers to create visually appealing marketing materials
\\end{itemize}

\\textbf{University Marketing Department} \\hfill City, State\\\\
\\textit{Student Assistant} \\hfill September 2021 - Present
\\begin{itemize}[leftmargin=*]
    \\item Help manage social media accounts for university events and announcements
    \\item Write content for the university blog and newsletter
    \\item Support the marketing team during campus events and promotional activities
    \\item Update the department website with new content and announcements
\\end{itemize}

\\textbf{Retail Store Name} \\hfill City, State\\\\
\\textit{Sales Associate} \\hfill June 2020 - August 2021
\\begin{itemize}[leftmargin=*]
    \\item Provided customer service to 50+ customers daily
    \\item Managed inventory and restocked merchandise
    \\item Processed sales transactions and handled cash and credit card payments
    \\item Consistently met or exceeded monthly sales targets
\\end{itemize}

\\section{SKILLS}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{Technical:} Microsoft Office Suite (Word, Excel, PowerPoint), Google Analytics, Canva, Hootsuite, Basic HTML/CSS
    \\item \\textbf{Marketing:} Social Media Marketing, Content Creation, Email Marketing, SEO Basics, Marketing Analytics
    \\item \\textbf{Soft Skills:} Communication, Teamwork, Time Management, Attention to Detail, Problem Solving
    \\item \\textbf{Languages:} English (Native), Spanish (Intermediate)
\\end{itemize}

\\section{PROJECTS}
\\textbf{Marketing Campaign Project} \\hfill Fall 2022
\\begin{itemize}[leftmargin=*]
    \\item Developed a comprehensive marketing campaign for a local business as part of a class project
    \\item Created social media strategy, content calendar, and email marketing templates
    \\item Presented campaign proposal to business owner and received excellent feedback
    \\item Project received an A grade and was featured as an example for future classes
\\end{itemize}

\\section{ACTIVITIES \& LEADERSHIP}
\\textbf{Marketing Club} \\hfill University Name\\\\
\\textit{Vice President} \\hfill September 2022 - Present
\\begin{itemize}[leftmargin=*]
    \\item Organize weekly meetings and workshops for 30+ club members
    \\item Coordinate guest speakers from local businesses and marketing agencies
    \\item Manage club social media accounts and email communications
\\end{itemize}

\\textbf{Volunteer Experience} \\hfill Local Community Center\\\\
\\textit{Social Media Volunteer} \\hfill January 2022 - Present
\\begin{itemize}[leftmargin=*]
    \\item Create and schedule posts for the community center's social media platforms
    \\item Design flyers and digital graphics for community events
    \\item Help increase social media engagement by 35\\% through strategic content planning
\\end{itemize}

\\end{document}`,
      category: TemplateCategory.ENTRY_LEVEL,
      tags: ["Entry Level", "Student", "Graduate", "Marketing"],
      isAdminCreated: true,
      userId: admin.id,
      thumbnail: "https://images.unsplash.com/photo-1563212034-a3c59913afbe?q=80&w=2127&auto=format&fit=crop",
    },
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