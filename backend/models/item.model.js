import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    shop:{type:mongoose.Schema.Types.ObjectId,ref:"Shop",required:true},
    category:{
        type:String,
        enum:["Beverages","Snacks","Meals","Desserts","Main Course","Chinese","Indian","Italian","Mexican","Fast Food","Others"],
        required:true
    },
    price:{type:Number,min:0,required:true},
    foodType:{type:String,enum:["Veg","Non-Veg"],required:true},
}, {timestamps:true});

export default mongoose.model("Item",itemSchema);