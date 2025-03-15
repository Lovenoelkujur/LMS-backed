const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const courseProgressContainer = require("../controllers/courseProgressController");

const router = express.Router();

// Get Course Progress Data
router.get("/:courseId", isAuthenticated, courseProgressContainer.getCourseProgress);

// Update Lecture Progress
router.post("/:courseId/lecture/:lectureId/view", isAuthenticated, courseProgressContainer.updateLectureProgress);

// Marked as Completed
router.post("/:courseId/complete", isAuthenticated, courseProgressContainer.markAsCompleted);

// Marked as Incomplete
router.post("/:courseId/incomplete", isAuthenticated, courseProgressContainer.markAsInCompleted);

module.exports = router;