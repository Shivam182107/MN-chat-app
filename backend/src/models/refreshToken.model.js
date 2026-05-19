const mongoose=require("mongoose");
const refreshTokenSchema=new mongoose.Schema({
    token:{type:String,required:true},
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"user",require:true},
    creted:{type:Date,default:Date.now(),
       expires:86400*7//60*24*7*60 
    }
}) 
const refreshTokenModel=mongoose.model("refreshTokenModel",refreshTokenSchema);
module.exports=refreshTokenModel;