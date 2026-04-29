import User from "../models/user.model.js"
import RestaurantPartner from "../models/restaurantPartner.model.js";
import DeliveryPartner from "../models/deliveryPartner.model.js";

const modelByRole = {
    user: User,
    restaurantPartner: RestaurantPartner,
    deliveryPartner: DeliveryPartner,
};

export const GetCurrUser = async(req,res)=>{
    try{
        const userId = req.userId
        const userRole = req.userRole || "user";
        if(!userId){
            return res.status(400).json({message:"userId is not found"})
        }

        const model = modelByRole[userRole] || User;
        const user = await model.findById(userId)
        if(!user){
            return res.status(400).json({message:"user is not found"})
        }

        return res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({message:"get current user error"})

    }

}
