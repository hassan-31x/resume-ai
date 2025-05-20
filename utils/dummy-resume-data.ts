// Dummy resume data for previewing templates
export const dummyResumeData = {
  // Personal Information
  fullName: "John Smith",
  jobTitle: "Software Engineer",
  
  // Contact Information
  email: "john.smith@example.com",
  phone: "(123) 456-7890",
  location: "San Francisco, CA",
  website: "johnsmith.dev",
  linkedin: "linkedin.com/in/johnsmith",
  github: "github.com/johnsmith",
  
  // Education
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      location: "Boston, MA",
      startDate: "Sep 2018",
      endDate: "May 2022",
      gpa: "3.85/4.0",
      achievements: [
        "Dean's List: 7 consecutive semesters",
        "Senior Capstone Project: AI-powered scheduling system"
      ]
    },
    {
      school: "Community College",
      degree: "Associate's Degree in Information Technology",
      location: "San Francisco, CA",
      startDate: "Sep 2016",
      endDate: "May 2018",
      gpa: "3.9/4.0",
      achievements: []
    }
  ],
  
  // Professional Experience
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Innovators Inc.",
      location: "San Francisco, CA",
      startDate: "Jun 2022",
      endDate: "Present",
      responsibilities: [
        "Developed and maintained web applications using React, Node.js, and MongoDB",
        "Led a team of 5 developers in redesigning the company's flagship product",
        "Improved application performance by 40% through code optimization and caching strategies",
        "Implemented CI/CD pipelines reducing deployment time by 65%"
      ]
    },
    {
      title: "Software Engineering Intern",
      company: "Startup Innovations",
      location: "San Francisco, CA",
      startDate: "May 2021",
      endDate: "Aug 2021",
      responsibilities: [
        "Assisted in developing RESTful APIs using Express.js and MongoDB",
        "Implemented responsive UI components using React and Material-UI",
        "Participated in daily stand-ups and biweekly sprint planning meetings",
        "Created unit tests increasing code coverage by 25%"
      ]
    }
  ],
  
  // Skills
  skills: {
    technical: [
      "JavaScript/TypeScript", "React", "Node.js", "Express", 
      "MongoDB", "PostgreSQL", "AWS", "Docker", "Git"
    ],
    languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    frameworks: ["React", "Angular", "Vue.js", "Express", "Django"],
    databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
    tools: ["Git", "Docker", "AWS", "Jenkins", "JIRA"],
    softSkills: ["Leadership", "Communication", "Problem-solving", "Teamwork"]
  },
  
  // Projects
  projects: [
    {
      title: "E-commerce Platform",
      link: "github.com/johnsmith/e-commerce",
      description: "A full-stack e-commerce platform with payment processing and inventory management",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      points: [
        "Implemented user authentication and authorization using JWT",
        "Integrated Stripe payment gateway for secure transactions",
        "Developed a responsive design that works across all devices"
      ]
    },
    {
      title: "Task Management App",
      link: "github.com/johnsmith/task-manager",
      description: "A productivity application for managing tasks and projects",
      technologies: ["React Native", "Firebase", "Redux"],
      points: [
        "Created a cross-platform mobile application using React Native",
        "Implemented real-time updates using Firebase Firestore",
        "Built state management with Redux for predictable application behavior"
      ]
    }
  ]
}; 