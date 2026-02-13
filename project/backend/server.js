const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const internshipRoutes = require("./routes/internships");
const swipeRoutes = require("./routes/swipes");
const matchRoutes = require("./routes/matches");
const chatRoutes = require("./routes/chat");
const aiRoutes = require("./routes/ai");

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/swipes", swipeRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

const startServer = async () => {
  if (mongoUri) {
    const client = new MongoClient(mongoUri);
    try {
      await client.connect();
      app.locals.mongo = client.db();
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed", error.message);
    }
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
