const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const cloudinaryContainer = require("../utils/cloudinary");

// Register
const register = async(req, res) => {
    try {

        const {name, email, password} = req.body;
        
        // Check for all the field
        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required!",
            });
        }

        // check for email already exist
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success : false,
                message : "User already exist with this email!",
            });
        }

        // bycrypt Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            name,
            email,
            password : hashedPassword
        });

        return res.status(201).json({
            success : true,
            message : "Account Created Successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to Register",
        });
    }
}

// Login
const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        // Check for all the field
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required!",
            });
        }

        // Check for user exist in database
        // Check fro Email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password!",
            });
        }

        // Check for Password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password!",
            });
        }

        // Generate Token
        generateToken(res, user, `Welcome back ${user.name}`);


    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to Login",
        });
    }
}

// Logout
const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            success : true,
            message : "Logged Out Successfully.",
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to Logout",
        });
    }
}

// Get User Profile
const getUserProfile = async(req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).select("-password").populate("enrolledCourses");

        if(!user){
            return res.status(404).json({
                success : false,
                message : "Profile Not Found",
            });
        }

        return res.status(200).json({
            success : true,
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to load user profile",
        });
    }
}

// Update Profile
const updateProfile = async(req, res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            });
        }

        // Extract public Id of the old img from the url if it exists
        if(user.photoUrl){
            // Extract Public Id
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            // deleteMediaFromCloudinary(publicId);
            cloudinaryContainer.deleteMediaFromCloudinary(publicId)
        }

        // Upload New Photo 
        const cloudResponse = await cloudinaryContainer.uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        // Update Data
        const updateData = {name, photoUrl};
        const updateUser = await User.findByIdAndUpdate(userId, updateData, {new:true}).select("-password");

        return res.status(200).json({
            success : true,
            message : "Profile Updated Successfully",
            user : updateUser,
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to update profile!",
        });
    }
}

const userController = {
    register,
    login,
    logout,
    getUserProfile,
    updateProfile,
}

module.exports = userController;