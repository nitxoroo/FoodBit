import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
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
        unique: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "deliveryPartner",
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

const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartner;
