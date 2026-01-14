const express = require("express");
const router = express.Router();
const db = require("../db/mysql");

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

    const [countResult] = await db.query(countQuery, params.slice(0, params.length - 2));
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


module.exports = router; 