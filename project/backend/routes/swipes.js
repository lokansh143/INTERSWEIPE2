const express = require("express");
const Swipe = require("../models/Swipe");

const router = express.Router();

let swipeEvents = [];

const interestedStudents = [
  {
    internshipId: "1",
    internshipTitle: "Software Engineering Intern",
    likes: [
      {
        id: "student1",
        name: "Alex Johnson",
        headline: "Full-stack SWE @ UT Austin",
        location: "Austin, TX",
        skills: ["React", "Node.js", "TypeScript"],
        likedAt: new Date().toISOString()
      },
      {
        id: "student7",
        name: "Priya Sharma",
        headline: "Backend Engineer - IIT Delhi",
        location: "New Delhi, India",
        skills: ["Go", "MongoDB", "AWS"],
        likedAt: new Date().toISOString()
      }
    ]
  },
  {
    internshipId: "2",
    internshipTitle: "Product Design Intern",
    likes: [
      {
        id: "student2",
        name: "Maya Patel",
        headline: "UX Research - RISD",
        location: "Providence, RI",
        skills: ["Figma", "User Research", "Prototyping"],
        likedAt: new Date().toISOString()
      }
    ]
  },
  {
    internshipId: "3",
    internshipTitle: "Data Analyst Intern",
    likes: [
      {
        id: "student3",
        name: "Jordan Lee",
        headline: "Data Science @ Georgia Tech",
        location: "Atlanta, GA",
        skills: ["SQL", "Python", "Tableau"],
        likedAt: new Date().toISOString()
      },
      {
        id: "student9",
        name: "Ananya Desai",
        headline: "Analytics Fellow",
        location: "Mumbai, India",
        skills: ["PowerBI", "R", "Forecasting"],
        likedAt: new Date().toISOString()
      }
    ]
  }
];

const recordSwipe = ({ userId, internshipId, direction }) => {
  swipeEvents.push(new Swipe({
    id: Date.now().toString(36),
    userId,
    internshipId,
    direction
  }));

  if (direction === "right") {
    const entry = interestedStudents.find((item) => item.internshipId === internshipId);
    if (!entry) {
      interestedStudents.push({ internshipId, internshipTitle: "", likes: [] });
    }
  }
};

router.post("/", (req, res) => {
  const { userId, internshipId, direction } = req.body || {};
  if (!userId || !internshipId || !direction) {
    return res.status(400).json({ error: "userId, internshipId, and direction are required" });
  }

  recordSwipe({ userId, internshipId, direction });
  res.status(201).json({ status: "recorded" });
});

router.get("/likes/:internshipId", (req, res) => {
  const { internshipId } = req.params;
  const record = interestedStudents.find((item) => item.internshipId === internshipId);
  res.json({
    internshipId,
    likes: record ? record.likes : []
  });
});

module.exports = router;
