import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to the database", mongoose.connection.host);
    } catch (error) {
        console.log("Error in connecting to the database", error);
    }
}
export default connectDb;