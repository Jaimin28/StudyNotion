const express = require("express");
const app = express();

const userRoutes = require("../SERVER/routes/User");
const profileRoutes = require("../SERVER/routes/Profile");
const paymentRoutes = require("../SERVER/routes/Payment");
const courseRoutes = require("../SERVER/routes/Course");

require("dotenv").config();

const database = require("../SERVER/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {cloudinaryconnect} = require("../SERVER/config/cloudinary");
const fileUpload= require("express-fileupload");

const PORT = process.env.PORT || 3000;

// database connect

database.dbConnect();

// middlwares

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
);

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
);

// cloudinary connect

cloudinaryconnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);


// def route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running"
    })
});

app.listen(4000,()=>{
    console.log(`App is runnning at ${PORT}`); 
})

