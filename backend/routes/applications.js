const express = require("express");
const router = express.Router();
const db = require("../db/mysql");
const multer = require("multer");
const path = require("path");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/check", protect, async (req, res) => {
  try {
    const { job_id } = req.query;
    const user_id = req.user.id;

    if (!job_id) {
      return res.status(400).json({ message: "job_id is required" });
    }

    const [rows] = await db.query(
      "SELECT id FROM applications WHERE job_id = ? AND user_id = ?",
      [job_id, user_id]
    );

    res.json({ applied: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, upload.single("resume"), async (req, res) => {
  try {
    const { job_id, name, email } = req.body;
    const user_id = req.user.id;
    const resume = req.file?.filename;

    if (!job_id || !name || !email || !resume) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await db.query(
      `INSERT INTO applications (job_id, user_id, name, email, resume)
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, user_id, name, email, resume]
    );

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/recruiter", protect, async (req, res) => {
  try {
    const recruiter_id = req.user.id;
    let { page = 1, limit = 10, status, sort = "desc" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.recruiter_id = ?
    `;

    let params = [recruiter_id];

    if (status) {
      baseQuery += ` AND a.status = ?`;
      params.push(status);
    }

    const dataQuery = `
      SELECT 
        a.id, a.name, a.email, a.resume, a.status, a.applied_at,
        j.title AS job_title
      ${baseQuery}
      ORDER BY a.applied_at ${sort === "asc" ? "ASC" : "DESC"}
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      ${baseQuery}
    `;

    const [applications] = await db.query(dataQuery, [
      ...params,
      limit,
      offset,
    ]);
    const [[countResult]] = await db.query(countQuery, params);

    res.json({
      page,
      limit,
      totalApplications: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
      applications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        a.id,
        a.job_id,         -- ADD THIS
        a.status,
        a.applied_at,
        j.title AS job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ?
      ORDER BY a.applied_at DESC
    `;

    const [rows] = await db.query(query, [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:id/status", protect, recruiterOnly, async (req, res) => {
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

router.delete("/:id", protect, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const [app] = await db.query(
      "SELECT * FROM applications WHERE id = ? AND user_id = ? AND status = 'Applied'",
      [id, user_id]
    );

    if (!app.length) {
      return res.status(400).json({ message: "Cannot withdraw now" });
    }

    await db.query("DELETE FROM applications WHERE id = ?", [id]);
    res.json({ message: "Application withdrawn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
