const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  res.status(201).json({ status: "recorded" });
});

module.exports = router;
