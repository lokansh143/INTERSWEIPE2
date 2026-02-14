const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Demo accounts (fallback when MongoDB is not available)
const demoAccounts = [
  {
    email: "demo@internswipe.com",
    password: "Demo@1234",
    name: "Demo Student",
    role: "student"
  },
  {
    email: "recruiter@internswipe.com",
    password: "Recruiter@123",
    name: "Demo Recruiter",
    role: "recruiter"
  }
];

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const db = req.app.locals.mongo;
    
    if (db) {
      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user document
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "student",
        createdAt: new Date()
      };

      const result = await db.collection("users").insertOne(newUser);

      // Generate token
      const token = jwt.sign(
        { userId: result.insertedId, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        message: "Registration successful",
        token,
        user: {
          id: result.insertedId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    }

    // Fallback without MongoDB
    return res.status(201).json({
      message: "Registration successful (demo mode)",
      user: {
        name: name || "New User",
        email,
        role: role || "student"
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check demo accounts FIRST (before MongoDB)
    const demoMatch = demoAccounts.find(
      (demo) => demo.email.toLowerCase() === email.toLowerCase() && demo.password === password
    );

    if (demoMatch) {
      const token = jwt.sign(
        { email: demoMatch.email, role: demoMatch.role },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "24h" }
      );

      return res.json({
        token,
        user: {
          email: demoMatch.email,
          name: demoMatch.name,
          role: demoMatch.role
        }
      });
    }

    const db = req.app.locals.mongo;

    if (db) {
      // Check MongoDB for user
      const user = await db.collection("users").findOne({ email: email.toLowerCase() });
      
      if (user) {
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
          { userId: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "dev_secret",
          { expiresIn: "24h" }
        );

        return res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    }

    return res.status(401).json({ error: "Invalid credentials" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
