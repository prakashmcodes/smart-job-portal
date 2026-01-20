const express = require("express");
const router = express.Router();
const db = require("../db/mysql");
const {
  searchJobs,
  getJobsWithPagination
} = require("../controllers/jobsController");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");


router.get("/", getJobsWithPagination);


router.get("/search", searchJobs);

router.post("/", protect, recruiterOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      experience,
      company_name,
      company_about,
      company_logo,
      company_website,
    } = req.body;

    const recruiter_id = req.user.id;

    if (!title || !description || !location || !experience || !company_name) {
      return res.status(400).json({ message: "All required fields must be filled" });
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        requirements || null,
        location,
        experience,
        company_name,
        company_about || null,
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

router.get("/:id/related", async (req, res) => {
  try {
    const { id } = req.params;

    // Get current job
    const [[job]] = await db.query(
      "SELECT location FROM jobs WHERE id = ?",
      [id]
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Find related jobs by same location, exclude current job
    const [relatedJobs] = await db.query(
      `SELECT * FROM jobs 
       WHERE location = ? AND id != ?
       ORDER BY created_at DESC 
       LIMIT 5`,
      [job.location, id]
    );

    res.json(relatedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Related jobs fetch failed" });
  }
});


// Job details
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

router.delete("/:id", protect, recruiterOnly, async (req, res) => {
  const { id } = req.params;
  const recruiter_id = req.user.id;

  const [job] = await db.query(
    "SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?",
    [id, recruiter_id]
  );

  if (job.length === 0) {
    return res.status(404).json({ message: "Job not found or unauthorized" });
  }

  await db.query("DELETE FROM jobs WHERE id = ?", [id]);
  res.json({ message: "Job deleted successfully" });
});

module.exports = router;
