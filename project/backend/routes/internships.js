const express = require("express");
const { ObjectId } = require("mongodb");
const Internship = require("../models/Internship");

const router = express.Router();

// In-memory storage fallback when MongoDB is not connected
let inMemoryInternships = [
  {
    id: "1",
    title: "Product Design Intern",
    company: "Northwind Labs",
    location: "Remote",
    stipend: "$1,200 / mo",
    skills: ["Figma", "User Research", "Prototyping"],
    description: "Join our design team to create beautiful user experiences.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "Lumen Metrics",
    location: "New York, NY",
    stipend: "$1,500 / mo",
    skills: ["SQL", "Python", "Tableau"],
    description: "Work with data to drive business insights.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Software Engineering Intern",
    company: "Apex Systems",
    location: "Austin, TX",
    stipend: "$1,800 / mo",
    skills: ["React", "Node.js", "APIs"],
    description: "Build scalable web applications with modern technologies.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Machine Learning Intern",
    company: "DeepMind AI",
    location: "San Francisco, CA",
    stipend: "$2,500 / mo",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
    description: "Work on cutting-edge AI models and neural network research.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Frontend Developer Intern",
    company: "PixelPerfect Studios",
    location: "Remote",
    stipend: "$1,400 / mo",
    skills: ["React", "TypeScript", "CSS", "Tailwind"],
    description: "Create stunning, responsive web interfaces for our clients.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Backend Developer Intern",
    company: "CloudScale Inc",
    location: "Seattle, WA",
    stipend: "$1,700 / mo",
    skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
    description: "Build robust backend services and microservices architecture.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "Mobile App Developer Intern",
    company: "AppVenture",
    location: "Boston, MA",
    stipend: "$1,600 / mo",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    description: "Develop cross-platform mobile applications from scratch.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "8",
    title: "DevOps Intern",
    company: "InfraCloud Solutions",
    location: "Denver, CO",
    stipend: "$1,900 / mo",
    skills: ["Kubernetes", "Docker", "CI/CD", "Linux"],
    description: "Automate deployment pipelines and manage cloud infrastructure.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "9",
    title: "Cybersecurity Intern",
    company: "SecureNet Defense",
    location: "Washington, DC",
    stipend: "$2,000 / mo",
    skills: ["Network Security", "Penetration Testing", "Python", "Linux"],
    description: "Help identify vulnerabilities and strengthen security posture.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "10",
    title: "UX Research Intern",
    company: "UserFirst Design",
    location: "Chicago, IL",
    stipend: "$1,300 / mo",
    skills: ["User Research", "Surveys", "A/B Testing", "Analytics"],
    description: "Conduct user interviews and usability testing to improve products.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "11",
    title: "Blockchain Developer Intern",
    company: "CryptoLedger Labs",
    location: "Miami, FL",
    stipend: "$2,200 / mo",
    skills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
    description: "Build decentralized applications and smart contracts.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "12",
    title: "Data Science Intern",
    company: "InsightAI Analytics",
    location: "Remote",
    stipend: "$1,800 / mo",
    skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
    description: "Analyze large datasets and build predictive models.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "13",
    title: "Full Stack Developer Intern",
    company: "TechStack Solutions",
    location: "Los Angeles, CA",
    stipend: "$1,650 / mo",
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    description: "Work across the entire stack to deliver complete features.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "14",
    title: "QA Engineering Intern",
    company: "QualityFirst Tech",
    location: "Portland, OR",
    stipend: "$1,400 / mo",
    skills: ["Selenium", "Jest", "Cypress", "Test Automation"],
    description: "Design and implement automated testing frameworks.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  },
  {
    id: "15",
    title: "Cloud Engineering Intern",
    company: "SkyNet Cloud",
    location: "San Jose, CA",
    stipend: "$2,100 / mo",
    skills: ["AWS", "Azure", "Terraform", "Python"],
    description: "Design and deploy scalable cloud infrastructure solutions.",
    recruiterId: "demo",
    createdAt: new Date().toISOString()
  }
];

// Get all internships
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.mongo;
    if (db) {
      const internships = await db.collection("internships").find({}).toArray();
      return res.json({ internships: internships.map(doc => ({ ...doc, id: doc._id.toString() })) });
    }
    res.json({ internships: inMemoryInternships });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get internships by recruiter
router.get("/recruiter/:recruiterId", async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const db = req.app.locals.mongo;
    if (db) {
      const internships = await db.collection("internships").find({ recruiterId }).toArray();
      return res.json({ internships: internships.map(doc => ({ ...doc, id: doc._id.toString() })) });
    }
    res.json({ internships: inMemoryInternships.filter(i => i.recruiterId === recruiterId) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single internship
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.mongo;
    if (db) {
      const internship = await db.collection("internships").findOne({ _id: new ObjectId(id) });
      if (!internship) return res.status(404).json({ error: "Internship not found" });
      return res.json({ ...internship, id: internship._id.toString() });
    }
    const internship = inMemoryInternships.find(i => i.id === id);
    if (!internship) return res.status(404).json({ error: "Internship not found" });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new internship
router.post("/", async (req, res) => {
  try {
    const { title, company, location, stipend, skills, description, recruiterId } = req.body;
    
    if (!title || !company || !location) {
      return res.status(400).json({ error: "Title, company, and location are required" });
    }

    const internship = new Internship({
      title,
      company,
      location,
      stipend,
      skills: skills || [],
      description,
      recruiterId,
      createdAt: new Date().toISOString()
    });

    const db = req.app.locals.mongo;
    if (db) {
      const result = await db.collection("internships").insertOne(Internship.toDocument(internship));
      return res.status(201).json({ ...internship, id: result.insertedId.toString() });
    }

    internship.id = String(Date.now());
    inMemoryInternships.push(internship);
    res.status(201).json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update internship
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, stipend, skills, description } = req.body;

    const db = req.app.locals.mongo;
    if (db) {
      const result = await db.collection("internships").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { title, company, location, stipend, skills, description } },
        { returnDocument: "after" }
      );
      if (!result) return res.status(404).json({ error: "Internship not found" });
      return res.json({ ...result, id: result._id.toString() });
    }

    const index = inMemoryInternships.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Internship not found" });
    
    inMemoryInternships[index] = { ...inMemoryInternships[index], title, company, location, stipend, skills, description };
    res.json(inMemoryInternships[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete internship
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.mongo;
    if (db) {
      const result = await db.collection("internships").deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "Internship not found" });
      return res.json({ success: true });
    }

    const index = inMemoryInternships.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ error: "Internship not found" });
    
    inMemoryInternships.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
