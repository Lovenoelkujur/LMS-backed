const Course = require("../models/courseModel");
const Lecture = require("../models/lectureModel");
const {deleteMediaFromCloudinary, uploadMedia, deleteVideoFromCloudinary} = require("../utils/cloudinary");

// Create New Course
const createCourse = async(req, res) => {
    try {
        
        const {courseTitle, category} = req.body;

        if(!courseTitle || !category){
            return res.status(400).json({
                success : false,
                message : "Course Title and Category is required!",
            });
        }

        const course = Course.create({
            courseTitle,
            category,
            creator : req.id,
        })

        return res.status(201).json({
            success : true,
            message : "Course Created Successfully.",
            course,
        })

    } catch (error) {

        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Create Course",
        });
    }
};

// Search Course
const searchCourse = async(req, res) => {
    try {

        const {query = "", categories = [], sortByPrice = ""} = req.query;

        // create Search Query
        const searchCriteria = {
            isPublished : true,
            $or : [
                {courseTitle : {$regex : query, $options : "i"}},
                {subTitle : {$regex : query, $options : "i"}},
                {category : {$regex : query, $options : "i"}},
            ]
        };

        // If Categories is Selected
        if(categories.length > 0){
            searchCriteria.category = {$in : categories};
        }

        // Define Sorting Order (Low / High) Price
        const sortOptions = {};

        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;    // Sort by price in Ascending Order
        }
        else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1;   // Sort by price in Descending Order
        }

        let courses = await  Course.find(searchCriteria).populate({path : "creator", select : "name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success : true,
            courses : courses || [],
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Search Course",
        });
    }
}

// Get All Published Course
const getPublishedCourse = async(_, res) => {
    try {

        const courses = await Course.find({isPublished : true}).populate({path : "creator", select : "name photoUrl"});

        if(!courses){
            return res.status(404).json({
                success : false,
                message : "Course not found!",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Successfully Fetched All Published Courses.",
            courses,
        });
        
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Get Published Courses!",
        });
    }
}

// Get all the Course
const getCreatorCourses = async(req,res) => {
    try {
        
        const userId = req.id;

        const course = await Course.find({creator : userId});

        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course Not Found!",
                courses : []
            })
        }

        return res.status(200).json({
            success : true,
            message : "Fetch Courses successfully.",
            course,
        })

    } catch (error) {

        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to get Course",
        });
    }
};

// Update Course
const editCourse = async(req, res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found!"
            });
        }

        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];     // Getting Public Id
                await deleteMediaFromCloudinary(publicId);      // Delete Old IMG
            }
            // Upload a Thumbnail on Cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        // Getting New Data to update
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail : courseThumbnail?.secure_url};

        // Updata Data
        course = await Course.findByIdAndUpdate(courseId, updateData, {new : true});

        return res.status(200).json({
            success : true,
            message : "Course Updated Successfully.",
            course,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to update Course!",
        });
    }
};

// Get course by Id
const getCourseById = async(req, res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found!",
            });
        }

        return res.status(200).json({
            success : true,
            message : "Course Fetch Successfully.",
            course,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Get Course by ID!",
        });
    }
};

// ---------------- Lecture Part ----------------

// Create Lecture
const createLecture = async(req, res) => {
    try {

        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                success : false,
                message : "Lecture Title Required!",
            });
        }

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        // Get Course Id
        const course = await Course.findById(courseId);

        // Push Lecture id into Course Data
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        };

        return res.status(201).json({
            success : true,
            message : "Lecture Created Successfully.",
            lecture,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Create Lecture!",
        });
    }
};

// Get Course Lecture
const getCourseLecture = async(req, res) => {
    try {

        const {courseId} = req.params;

        const course = await Course.findById(courseId).populate("lectures");

        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course Lecture Not Found!",
            });
        };

        return res.status(200).json({
            success : true,
            message : "Got Course Lecture Successfully.",
            lectures : course.lectures,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Get Course Lecture!",
        });
    }
};

// Edit Lecture (update lecture)
const editLecture = async(req, res) => {
    try {

        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        const {courseId, lectureId} = req.params;

        const lecture = await Lecture.findById(lectureId);

        // If No Lecture Found
        if(!lecture){
            return res.status(404).json({
                success : false,
                message : "Lecture Not Found!",
            });
        }

        // Update Lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture Id if it was not already added
        const course = await Course.findById(courseId);

        // Add lecture Id into Course
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await lecture.save();
        }

        return res.status(200).json({
            success : true,
            message : "Lecture Updated Successfully.",
            lecture,
        });
        
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Edit Lecture!",
        });
    }
}

// Remove Lecture (Delete Lecture)
const removeLecture = async(req, res) => {
    try {

        const {lectureId} = req.params;

        const lecture = await Lecture.findByIdAndDelete(lectureId);

        if(!lecture){
            return res.status(404).json({
                success : false,
                message : "Lecture Not Found",
            });
        }

        // Delete lecture from Cloudinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures : lectureId},                 // Find the course that contains lecture
            {$pull : {lectures : lectureId}}        // Remove the lecture Id from the lectures array
        );

        return res.status(200).json({
            success : true,
            message : "Lecture Remove Successfully.",
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to Remove Lecture!",
        });
    }
}

// Get Lecture By Id
const getLectureById = async(req, res) => {
    try {
        
        const {lectureId} = req.params;

        const lecture = await Lecture.findById(lectureId);

        if(!lecture){
            return res.status(404).json({
                success : false,
                message : "Lecture not found!"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Got Lecture Successfully.",
            lecture,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to get lecture by id!",
        });
    }
}

// Publish && Un-Publish Course Logic
const togglePublishCourse = async(req, res) => {
    try {
        
        const {courseId} = req.params;
        const {publish} = req.query;                // (true(publish) or false(unPublish))
        
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success : false,
                message : "Course not found!",
            });
        }

        // Publish Status based on the query parameter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";

        return res.status(200).json({
            success : true,
            message : `Course is ${statusMessage}`,
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            success : false,
            message : "Failed to update status!",
        });
    }
}


// Container for Course handle
const courseContainer = {
    createCourse,
    searchCourse,
    getPublishedCourse,
    getCreatorCourses,
    editCourse,
    getCourseById,
    createLecture,
    getCourseLecture,
    editLecture,
    removeLecture,
    getLectureById,
    togglePublishCourse,
};

module.exports = courseContainer;