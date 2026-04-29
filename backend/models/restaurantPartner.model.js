import mongoose from "mongoose";

const restaurantPartnerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    restaurantAddress: {
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
        unique: true,
    },
    role: {
        type: String,
        default: "restaurantPartner",
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
    },
    isAuthenticated: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const RestaurantPartner = mongoose.model("RestaurantPartner", restaurantPartnerSchema);

export default RestaurantPartner;
