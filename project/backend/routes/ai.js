const express = require("express");

const router = express.Router();

// Student profiles database (in-memory for demo)
const studentProfiles = [
  {
    id: "1",
    name: "Ava Patel",
    email: "ava.patel@sjsu.edu",
    major: "Computer Science",
    university: "San Jose State University",
    location: "San Jose, CA",
    grad: "2026",
    gpa: "3.7",
    availability: "Summer 2026",
    headline: "Full-stack builder focused on web platforms",
    experience: "Built a campus events app with 5k users",
    skills: ["React", "Node.js", "APIs", "MongoDB", "JavaScript", "CSS"]
  },
  {
    id: "2",
    name: "Liam Chen",
    email: "liam.chen@columbia.edu",
    major: "Data Science",
    university: "Columbia University",
    location: "New York, NY",
    grad: "2025",
    gpa: "3.8",
    availability: "Spring 2025",
    headline: "Analytics intern with strong storytelling",
    experience: "Dashboarded retail KPIs across 12 stores",
    skills: ["Python", "SQL", "Tableau", "Pandas", "Data Analysis", "Machine Learning"]
  },
  {
    id: "3",
    name: "Mia Rodriguez",
    email: "mia.rodriguez@utexas.edu",
    major: "Product Design",
    university: "UT Austin",
    location: "Austin, TX",
    grad: "2026",
    gpa: "3.6",
    availability: "Summer 2026",
    headline: "UX designer who ships fast iterations",
    experience: "Designed onboarding for a healthtech startup",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "User Research", "Adobe XD"]
  },
  {
    id: "4",
    name: "Noah Kim",
    email: "noah.kim@gmu.edu",
    major: "Cybersecurity",
    university: "George Mason University",
    location: "Arlington, VA",
    grad: "2025",
    gpa: "3.5",
    availability: "Fall 2025",
    headline: "Blue-team focused, loves incident response",
    experience: "Ran tabletop exercises for SOC workflows",
    skills: ["SIEM", "Networking", "Incident Response", "Python", "Security", "Linux"]
  },
  {
    id: "5",
    name: "Sophia Nguyen",
    email: "sophia.nguyen@cmu.edu",
    major: "Software Engineering",
    university: "Carnegie Mellon",
    location: "Pittsburgh, PA",
    grad: "2025",
    gpa: "3.9",
    availability: "Summer 2025",
    headline: "Backend engineer who optimizes APIs",
    experience: "Reduced latency 30% in microservices",
    skills: ["Java", "Spring", "PostgreSQL", "AWS", "APIs", "Node.js"]
  },
  {
    id: "6",
    name: "Daniel Okafor",
    email: "daniel.okafor@stanford.edu",
    major: "AI Research",
    university: "Stanford University",
    location: "San Francisco, CA",
    grad: "2026",
    gpa: "3.8",
    availability: "Summer 2026",
    headline: "ML researcher focused on NLP models",
    experience: "Published poster on summarization metrics",
    skills: ["PyTorch", "NLP", "Python", "Machine Learning", "TensorFlow", "Data Science"]
  },
  {
    id: "7",
    name: "Emma Wilson",
    email: "emma.wilson@mit.edu",
    major: "Computer Science",
    university: "MIT",
    location: "Boston, MA",
    grad: "2025",
    gpa: "3.9",
    availability: "Summer 2025",
    headline: "Full-stack developer with startup experience",
    experience: "Co-founded a study group matching app",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "GraphQL", "AWS"]
  },
  {
    id: "8",
    name: "James Park",
    email: "james.park@berkeley.edu",
    major: "Data Science",
    university: "UC Berkeley",
    location: "San Francisco, CA",
    grad: "2026",
    gpa: "3.7",
    availability: "Summer 2026",
    headline: "Data scientist with ML deployment experience",
    experience: "Built recommendation engine for e-commerce",
    skills: ["Python", "SQL", "Tableau", "Machine Learning", "Spark", "AWS"]
  }
];

// Calculate match score between internship skills and student skills
function calculateMatchScore(internshipSkills, studentSkills) {
  if (!internshipSkills || !studentSkills || internshipSkills.length === 0) {
    return 0;
  }
  
  const normalizedInternshipSkills = internshipSkills.map(s => s.toLowerCase().trim());
  const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase().trim());
  
  let matchCount = 0;
  for (const skill of normalizedInternshipSkills) {
    if (normalizedStudentSkills.some(s => s.includes(skill) || skill.includes(s))) {
      matchCount++;
    }
  }
  
  // Calculate percentage match
  const score = Math.round((matchCount / normalizedInternshipSkills.length) * 100);
  
  // Add some variance based on student quality indicators
  return Math.min(100, score);
}

// Get matched students for recruiter's internships
router.get("/matches/recruiter", async (req, res) => {
  try {
    // Get all internships (in production, filter by recruiterId)
    const db = req.app.locals.mongo;
    let internships = [];
    
    if (db) {
      const docs = await db.collection("internships").find({}).toArray();
      internships = docs.map(doc => ({ ...doc, id: doc._id.toString() }));
    } else {
      // Use in-memory internships from internships route
      const internshipsRoute = require("./internships");
      // Fallback to hardcoded list
      internships = [
        { id: "1", title: "Product Design Intern", company: "Northwind Labs", skills: ["Figma", "User Research", "Prototyping"] },
        { id: "2", title: "Data Analyst Intern", company: "Lumen Metrics", skills: ["SQL", "Python", "Tableau"] },
        { id: "3", title: "Software Engineering Intern", company: "Apex Systems", skills: ["React", "Node.js", "APIs"] }
      ];
    }

    // For each internship, find matching students
    const matchedStudents = [];
    const addedStudentIds = new Set();

    for (const internship of internships) {
      for (const student of studentProfiles) {
        const score = calculateMatchScore(internship.skills || [], student.skills);
        
        if (score >= 40 && !addedStudentIds.has(`${student.id}-${internship.id}`)) {
          addedStudentIds.add(`${student.id}-${internship.id}`);
          matchedStudents.push({
            id: `${student.id}-${internship.id}`,
            student: {
              id: student.id,
              name: student.name,
              email: student.email,
              major: student.major,
              university: student.university,
              location: student.location,
              grad: student.grad,
              gpa: student.gpa,
              availability: student.availability,
              headline: student.headline,
              experience: student.experience,
              skills: student.skills
            },
            internship: {
              id: internship.id,
              title: internship.title,
              company: internship.company,
              skills: internship.skills
            },
            score,
            matchedSkills: (internship.skills || []).filter(s => 
              student.skills.some(ss => ss.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ss.toLowerCase()))
            )
          });
        }
      }
    }

    // Sort by score descending
    matchedStudents.sort((a, b) => b.score - a.score);

    res.json({ matches: matchedStudents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/match", (req, res) => {
  res.json({ result: "placeholder" });
});

module.exports = router;
