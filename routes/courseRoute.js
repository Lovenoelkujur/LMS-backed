const express = require("express");
const courseContainer = require("../controllers/courseController");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../utils/multer");

const router = express.Router();

// Create Course
router.post("/", isAuthenticated, courseContainer.createCourse);

// Search Courses
router.get("/search", isAuthenticated, courseContainer.searchCourse);

// Get All Published Courses
router.get("/published-courses", courseContainer.getPublishedCourse);

// Get All Course
router.get("/", isAuthenticated, courseContainer.getCreatorCourses);

// Update Course (Edit Course)
router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), courseContainer.editCourse);

// Get Course by Id
router.get("/:courseId", isAuthenticated, courseContainer.getCourseById);

// -------------- Lecture Part -----------------

// Create Lecture
router.post("/:courseId/lecture", isAuthenticated, courseContainer.createLecture);

// Get Course Lecture
router.get("/:courseId/lecture", isAuthenticated, courseContainer.getCourseLecture);

// Edit Lecture
router.post("/:courseId/lecture/:lectureId", isAuthenticated, courseContainer.editLecture);

// Remove Lecture
router.delete("/lecture/:lectureId", isAuthenticated, courseContainer.removeLecture);

// Get Lecture by Id
router.get("/lecture/:lectureId", isAuthenticated, courseContainer.getLectureById);

// Update Toggle Publish && Unpublish Course
router.patch("/:courseId", isAuthenticated, courseContainer.togglePublishCourse);

module.exports = router;