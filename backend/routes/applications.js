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
  },
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

router.get("/", async (req, res) => {
  try {
    const { user_id, role } = req.query;

    let query = `
      SELECT 
        a.id,
        a.name,
        a.email,
        a.resume,
        a.status,
        a.applied_at,
        j.title AS job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
    `;

    let params = [];

    // Recruiter → only see applications for their jobs
    if (role === "recruiter") {
      query += ` WHERE j.recruiter_id = ?`;
      params.push(user_id);
    }

    // Candidate → only see their own applications
    if (role === "candidate") {
      query += ` WHERE a.user_id = ?`;
      params.push(user_id);
    }

    query += ` ORDER BY a.applied_at DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Applied", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const [result] = await db.query(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
