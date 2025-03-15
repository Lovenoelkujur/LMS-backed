const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const userRouter = require("./routes/userRoute");
const courseRouter = require("./routes/courseRoute");
const mediaRoute = require("./routes/mediaRoute");
const purchaseRoute = require("./routes/purchaseCourseRoute");
const courseProgressRoute = require("./routes/courseProgressRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
dotenv.config({});

// DB Connection
connectDB();

const PORT = process.env.PORT || 9000;

// Default Middleware
app.use(express.json());
app.use(cookieParser());

// Cors
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}));

// Router APIs
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);  
});