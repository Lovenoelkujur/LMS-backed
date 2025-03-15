const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({});

// Configuration
cloudinary.config({
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET,
    cloud_name : process.env.CLOUD_NAME,
});

// Upload an image
const uploadMedia = async(file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type : "auto",
        });

        return uploadResponse;
        
    } catch (error) {
        console.log(error);
        
    }
}

// Delete old image
const deleteMediaFromCloudinary = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error); 
    }
}

// Delete Video 
const deleteVideoFromCloudinary = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {resourse_type : "video"});
    } catch (error) {
        console.log(error); 
    }
}

const cloudinaryContainer = {
    uploadMedia,
    deleteMediaFromCloudinary,
    deleteVideoFromCloudinary
};

module.exports = cloudinaryContainer;