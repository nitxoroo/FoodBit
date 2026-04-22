import User from "../models/user.model.js";
import bcryptjs from "bcrypt";
import generateToken from "../utils/token.js";
import { sendOtpEmail } from "../utils/email.js";

export const signUp = async (req, res) => {
    try {
        const { fullname, email, password, mobileNumber} = req.body;

        // 1. Validation
        if (!fullname || !email || !password || !mobileNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const existingMobile = await User.findOne({ mobileNumber });
        if (existingMobile) {
            return res.status(400).json({ message: "Mobile number is already registered" });
        }

        // 3. Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // 4. Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            mobileNumber,
            
        });

        await newUser.save();

        // 5. Generate token (this uses the token utility we just built)
        const token = generateToken(newUser._id);

        // 6. Set cookie
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
            httpOnly: false, // Prevents XSS attacks (cookie cannot be accessed via JS)
            sameSite: "strict", // Prevents CSRF attacks
            secure: process.env.NODE_ENV !== "development", // https only in production
        });

        // 7. Send Success Response (exclude password)
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                mobileNumber: newUser.mobileNumber,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Error in signUp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Check password
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 4. Generate token and set cookie
        const token = generateToken(user._id);
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 15 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        // 5. Send success response
        res.status(200).json({
            message: "Signed in successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobileNumber: user.mobileNumber,
                
            }
        });

    } catch (error) {
        console.error("Error in signIn controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

        // 2. Find user by email
        const user = await User.findOne({ email });
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

        // 2. Find user by email
        const user = await User.findOne({ email });
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

        // 2. Find user by email
        const user = await User.findOne({ email });
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

