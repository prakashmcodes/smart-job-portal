const express = require("express");
const router = express.Router();
const db = require("../db/mysql");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { job_id, user_id, name, email } = req.body;
    const resume = req.file ? req.file.filename : null;

    if (!job_id || !user_id || !name || !email || !resume) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await db.query(
      `INSERT INTO applications 
       (job_id, user_id, name, email, resume)
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, user_id, name, email, resume]
    );

    res.status(201).json({ message: "Application submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;