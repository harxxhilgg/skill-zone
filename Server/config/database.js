import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_DB_URL, {
        dbName: "study-notion"
    })
    .then(() => console.log("Database Connected"))
    .catch((e) => {
        console.log("Databse connection Failed")
        console.log(e)
        process.exit(1)
    })
}