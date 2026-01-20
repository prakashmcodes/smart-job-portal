const db = require("../db/mysql");

// Save job
const saveJob = async (req, res) => {
  try {
    const user_id = req.user.id;   // from JWT
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({ message: "job_id is required" });
    }

    await db.query(
      "INSERT INTO saved_jobs (user_id, job_id, created_at) VALUES (?, ?, NOW())",
      [user_id, job_id]
    );

    res.status(201).json({ message: "Job saved" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Already saved" });
    }
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
};

// Check saved
const checkSavedJob = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { job_id } = req.query;

    const [rows] = await db.query(
      "SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [user_id, job_id]
    );

    if (rows.length > 0) {
      res.json({ saved: true, saved_id: rows[0].id });
    } else {
      res.json({ saved: false, saved_id: null });
    }
  } catch (err) {
    res.status(500).json({ message: "Check failed" });
  }
};

// Get my saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        sj.id as saved_id,
        j.*
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ?
      ORDER BY sj.created_at DESC
    `, [user_id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Remove
const removeSavedJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await db.query(
      "DELETE FROM saved_jobs WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob,
};
