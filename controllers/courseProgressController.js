const Course = require("../models/courseModel");
const CourseProgress = require("../models/courseProgress");


// Get Course progress Data
const getCourseProgress = async(req, res) => {
    try {

        const {courseId} = req.params;
        const userId = req.id;

        // Step-1 Fetch the user course progress 
        let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Course not found!",
            });
        };

        // Step-2 If no progress found, return course details with an empty progress
        if(!courseProgress){
            return res.status(200).json({
                success : true,
                data : {
                    courseDetails,
                    progress : [],
                    completed : false
                },
            });
        };

        // Step-3 Return the users Course Progress along with course Details
        return res.status(200).json({
            success : true,
            data : {
                courseDetails,
                progress : courseProgress.lectureProgress,
                completed : courseProgress.completed,
            },
        });

    } catch (error) {
        console.log(error);    
    }
};

// Update Lecture Progress
const updateLectureProgress = async(req, res) => {
    try {

        const {courseId, lectureId} = req.params;
        const userId = req.id;

        // Fetch or Create Course Progress
        let courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            // If no Progress exist, Create a new Record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed : false,
                lectureProgress : [],
            });
        };

        // Find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

        if(lectureIndex !== -1){
            // if lecture already exist, update its status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }
        else{
            // Add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed : true,
            });
        }

        // If all lecture is complete
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);

        if(course.lectures.length === lectureProgressLength) courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            success : true,
            message : "Lecture progress updated successfully.",
        });

    } catch (error) {
        console.log(error);       
    }
};

// Mark as Completed 
const markAsCompleted = async(req, res) => {
    try {

        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            return res.status(404).json({
                success : false,
                message : "Course progress not found!",
            });
        }

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();

        return res.status(200).json({
            success : true,
            message : "Course marked as completed.",
        });

    } catch (error) {
        console.log(error);   
    }
};

// Mark as Incompleted 
const markAsInCompleted = async(req, res) => {
    try {

        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            return res.status(404).json({
                success : false,
                message : "Course progress not found!",
            });
        }

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();

        return res.status(200).json({
            success : true,
            message : "Course marked as Incompleted.",
        });

    } catch (error) {
        console.log(error);   
    }
};

// Container for all Course Progress
const courseProgressContainer = {
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsInCompleted,
};

module.exports = courseProgressContainer;