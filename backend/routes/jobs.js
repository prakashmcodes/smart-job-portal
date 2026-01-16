const express = require("express");
const router = express.Router();
const db = require("../db/mysql");

// Applicants applying job
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, title, location } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM jobs WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM jobs WHERE 1=1";
    let params = [];

    if (title) {
      query += " AND title LIKE ?";
      countQuery += " AND title LIKE ?";
      params.push(`%${title}%`);
    }

    if (location) {
      query += " AND location = ?";
      countQuery += " AND location = ?";
      params.push(location);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [jobs] = await db.query(query, params);

    const [countResult] = await db.query(
      countQuery,
      params.slice(0, params.length - 2)
    );
    const totalJobs = countResult[0].total;
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      page,
      limit,
      totalJobs,
      totalPages,
      jobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Recruiter Job Post

router.post("/", async (req, res) => {
  try {
   const {
  title,
  description,
  requirements,
  location,
  experience,
  company_name,
  company_about,
  company_website,
  recruiter_id
} = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !experience ||
      !company_name ||
      !recruiter_id
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const [recruiter] = await db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'recruiter'",
      [recruiter_id]
    );

    if (recruiter.length === 0) {
      return res.status(400).json({ message: "Invalid recruiter ID" });
    }

    const [result] = await db.query(
      `INSERT INTO jobs 
(title, description, requirements, location, experience, company_name, company_about, company_logo, company_website, recruiter_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
      [
        title,
        description,
        location,
        experience,
        company_name,
        company_logo || null,
        company_website || null,
        recruiter_id,
      ]
    );

    res.status(201).json({
      message: "Job created successfully",
      jobId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
