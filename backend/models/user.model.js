import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    
    resetOtp: {
        type: String,
        default: null,
    },
    resetOtpExpiry: {
        type: Date,
        default: null,
    },
    resetOtpVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
