import express from "express";
const app = express();

import { connectDB } from "./config/database.js";
import { respond } from "./utils/response.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors"
import dotenv from "dotenv"

import userRoute from "./routes/User.js"
import courseRoute from "./routes/Course.js"
import profileRoute from "./routes/Profile.js"
import paymentRoute from "./routes/Payment.js"

dotenv.config();

const PORT = process.env.PORT || 4000

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
    useTempFiles:true,
        tempFileDir:"/tmp"
})
)
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

cloudinaryConnect();

app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/payment",paymentRoute)

app.get("/", (req,res) => {
    return respond(res,"Your server is up and running",200,true)
});

app.listen(PORT, () => {
    console.log(`your server started at ${PORT}`);
})