import jwt from "jsonwebtoken"
import dotenv from "dotenv";
const isAuth = async (req,res,next) =>{
    try{
    
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }

        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodeToken){
            return res.status(400).json({message:"token not verify"})
        }

        req.userId = decodeToken.userId;
        req.userRole = decodeToken.role;
        next();
    }
    catch(err){
        return res.status(500).json({message:"token not found"});
    }
}

export default isAuth;
