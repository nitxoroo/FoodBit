import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    try {
        // Generate the token with userId as payload
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15d", // Token expires in 15 days
        });

        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Could not generate token");
    }
};

export default generateToken;