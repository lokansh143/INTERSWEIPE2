const express = require("express");
const { ObjectId } = require("mongodb");
const Match = require("../models/Match");

const router = express.Router();

// In-memory storage fallback
let inMemoryMatches = [
  {
    id: "1",
    studentId: "student1",
    studentName: "Alex Johnson",
    studentEmail: "alex.johnson@university.edu",
    studentSkills: ["React", "Node.js", "Python", "SQL"],
    internshipId: "1",
    internshipTitle: "Software Engineering Intern",
    company: "Apex Systems",
    recruiterId: "demo",
    status: "accepted",
    score: 92,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    studentId: "student2",
    studentName: "Maya Patel",
    studentEmail: "maya.patel@college.edu",
    studentSkills: ["Figma", "User Research", "Prototyping", "Adobe XD"],
    internshipId: "2",
    internshipTitle: "Product Design Intern",
    company: "Northwind Labs",
    recruiterId: "demo",
    status: "accepted",
    score: 88,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    studentId: "student3",
    studentName: "Jordan Lee",
    studentEmail: "jordan.lee@tech.edu",
    studentSkills: ["SQL", "Python", "Tableau", "Machine Learning"],
    internshipId: "3",
    internshipTitle: "Data Analyst Intern",
    company: "Lumen Metrics",
    recruiterId: "demo",
    status: "accepted",
    score: 85,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    studentId: "student4",
    studentName: "Sam Rivera",
    studentEmail: "sam.rivera@state.edu",
    studentSkills: ["React Native", "TypeScript", "Firebase"],
    internshipId: "4",
    internshipTitle: "Mobile App Intern",
    company: "Cloudline",
    recruiterId: "demo",
    status: "pending",
    score: 79,
    createdAt: new Date().toISOString()
  }
];

// Get all matches
router.get("/", async (req, res) => {
  try {
    const { status, recruiterId } = req.query;
    const db = req.app.locals.mongo;
    
    if (db) {
      const filter = {};
      if (status) filter.status = status;
      if (recruiterId) filter.recruiterId = recruiterId;
      const matches = await db.collection("matches").find(filter).toArray();
      return res.json({ matches: matches.map(doc => ({ ...doc, id: doc._id.toString() })) });
    }
    
    let filtered = inMemoryMatches;
    if (status) filtered = filtered.filter(m => m.status === status);
    if (recruiterId) filtered = filtered.filter(m => m.recruiterId === recruiterId);
    res.json({ matches: filtered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get accepted students for recruiter
router.get("/accepted", async (req, res) => {
  try {
    const { recruiterId } = req.query;
    const db = req.app.locals.mongo;
    
    if (db) {
      const filter = { status: "accepted" };
      if (recruiterId) filter.recruiterId = recruiterId;
      const matches = await db.collection("matches").find(filter).toArray();
      return res.json({ acceptedStudents: matches.map(doc => ({ ...doc, id: doc._id.toString() })) });
    }
    
    let filtered = inMemoryMatches.filter(m => m.status === "accepted");
    if (recruiterId) filtered = filtered.filter(m => m.recruiterId === recruiterId);
    res.json({ acceptedStudents: filtered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a match (when student swipes right and recruiter also likes)
router.post("/", async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, studentSkills, internshipId, internshipTitle, company, recruiterId, score } = req.body;
    
    const match = new Match({
      studentId,
      studentName,
      studentEmail,
      studentSkills,
      internshipId,
      internshipTitle,
      company,
      recruiterId,
      status: "pending",
      score,
      createdAt: new Date().toISOString()
    });

    const db = req.app.locals.mongo;
    if (db) {
      const result = await db.collection("matches").insertOne(Match.toDocument(match));
      return res.status(201).json({ ...match, id: result.insertedId.toString() });
    }

    match.id = String(Date.now());
    inMemoryMatches.push(match);
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update match status (accept/reject)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const db = req.app.locals.mongo;
    if (db) {
      const result = await db.collection("matches").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: "after" }
      );
      if (!result) return res.status(404).json({ error: "Match not found" });
      return res.json({ ...result, id: result._id.toString() });
    }

    const index = inMemoryMatches.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: "Match not found" });
    
    inMemoryMatches[index].status = status;
    res.json(inMemoryMatches[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a match
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.mongo;
    
    if (db) {
      const result = await db.collection("matches").deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "Match not found" });
      return res.json({ success: true });
    }

    const index = inMemoryMatches.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: "Match not found" });
    
    inMemoryMatches.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
