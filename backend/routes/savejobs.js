const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob,
} = require("../controllers/saveJobsController");

const router = express.Router();

router.post("/", protect, saveJob);
router.get("/check", protect, checkSavedJob);
router.get("/me", protect, getSavedJobs);
router.delete("/:id", protect, removeSavedJob);

module.exports = router;
