const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/match", (req, res) => {
  const { profile, preferences } = req.body || {};
  res.json({
    matches: [],
    received: { profile: profile || null, preferences: preferences || null },
    note: "Matching logic placeholder"
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
