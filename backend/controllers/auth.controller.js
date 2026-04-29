import User from "../models/user.model.js";
import RestaurantPartner from "../models/restaurantPartner.model.js";
import DeliveryPartner from "../models/deliveryPartner.model.js";
import bcryptjs from "bcrypt";
import generateToken from "../utils/token.js";
import { sendOtpEmail } from "../utils/email.js";

const accountModels = {
    user: User,
    restaurantPartner: RestaurantPartner,
    deliveryPartner: DeliveryPartner,
};

const accountMeta = {
    user: {
        label: "User",
        model: User,
        requiredFields: ["fullname", "email", "password", "mobileNumber"],
    },
    restaurantPartner: {
        label: "Restaurant Partner",
        model: RestaurantPartner,
        requiredFields: ["fullname", "restaurantName", "restaurantAddress", "email", "password", "mobileNumber"],
    },
    deliveryPartner: {
        label: "Delivery Partner",
        model: DeliveryPartner,
        requiredFields: ["fullname", "email", "password", "mobileNumber", "vehicleType", "licenseNumber"],
    },
};

const buildUserResponse = (account) => ({
    _id: account._id,
    fullname: account.fullname,
    email: account.email,
    mobileNumber: account.mobileNumber,
    role: account.role || "user",
    restaurantName: account.restaurantName ?? null,
    restaurantAddress: account.restaurantAddress ?? null,
    vehicleType: account.vehicleType ?? null,
    licenseNumber: account.licenseNumber ?? null,
});

const getRequiredValue = (body, field) => {
    const value = body[field];
    return typeof value === "string" ? value.trim() : value;
};

const validateRequiredFields = (body, fields) => {
    return fields.filter((field) => !getRequiredValue(body, field));
};

const findAccountByEmail = async (email) => {
    for (const model of Object.values(accountModels)) {
        const account = await model.findOne({ email });
        if (account) {
            return account;
        }
    }
    return null;
};

const findAccountByField = async (field, value) => {
    for (const model of Object.values(accountModels)) {
        const account = await model.findOne({ [field]: value });
        if (account) {
            return account;
        }
    }
    return null;
};

const buildAuthHandler = (accountType) => {
    const { model, label, requiredFields } = accountMeta[accountType];

    return async (req, res) => {
        try {
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const { fullname, email, password, mobileNumber, restaurantName, restaurantAddress, vehicleType, licenseNumber } = req.body;

            const existingUser = await model.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already registered" });
            }

            const existingMobile = await model.findOne({ mobileNumber });
            if (existingMobile) {
                return res.status(400).json({ message: "Mobile number is already registered" });
            }

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const newAccount = new model({
                fullname,
                email,
                password: hashedPassword,
                mobileNumber,
                ...(accountType === "restaurantPartner" ? { restaurantName, restaurantAddress } : {}),
                ...(accountType === "deliveryPartner" ? { vehicleType, licenseNumber } : {}),
            });

            await newAccount.save();

            const token = generateToken({
                userId: newAccount._id.toString(),
                role: accountType,
            });

            res.cookie("token", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development",
            });

            res.status(201).json({
                message: `${label} created successfully`,
                user: buildUserResponse(newAccount),
            });
        } catch (error) {
            console.error(`Error in ${accountType} signUp controller:`, error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

const buildSignInHandler = (accountType) => {
    const { model } = accountMeta[accountType];

    return async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const account = await model.findOne({ email });
            if (!account) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const isPasswordCorrect = await bcryptjs.compare(password, account.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const token = generateToken({
                userId: account._id.toString(),
                role: accountType,
            });

            res.cookie("token", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development",
            });

            res.status(200).json({
                message: "Signed in successfully",
                user: buildUserResponse(account),
            });
        } catch (error) {
            console.error(`Error in ${accountType} signIn controller:`, error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

export const signUp = buildAuthHandler("user");
export const signIn = buildSignInHandler("user");
export const signUpPartner = buildAuthHandler("restaurantPartner");
export const signInPartner = buildSignInHandler("restaurantPartner");
export const signUpDeliveryBoy = buildAuthHandler("deliveryPartner");
export const signInDeliveryBoy = buildSignInHandler("deliveryPartner");

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });

    }
    catch (error) {
        console.error("Error in logOut controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validation
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // 2. Find account by email across all auth collections
        const user = await findAccountByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 3. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOtp = otp.toString();
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // 4. Send OTP to user's email (using nodemailer)
        await sendOtpEmail(user.email, otp);

        // 5. Send success response
        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("FULL ERROR:", error); // 👈 IMPORTANT
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Validation
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // 2. Find account by email
        const user = await findAccountByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 3. Check if OTP is valid and not expired
        if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // 4. Clear OTP after verification
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        // 5. Send success response
        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error in verifyOtp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // 1. Validation
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        // 2. Find account by email
        const user = await findAccountByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 3. Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        user.password = hashedPassword;

        await user.save();

        // 4. Send success response
        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Error in resetPassword controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
