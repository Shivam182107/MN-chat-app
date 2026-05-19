const refreshTokenModel = require("../models/refreshToken.model");
const jwt=require("jsonwebtoken")
const user=require("../models/user.model")

module.exports.checkUserAuth=async(req,res,next)=>{
    const accessToken=req.cookies.accessToken||req.headers?.authorization?.split(" ")[1];
    const refreshToken=req.cookies.refreshToken;
    if(!accessToken||!refreshToken){
        return res.status(401).json({message:"Unauthorized access,Token is miising "})
    }

    const isExist=await refreshTokenModel.findOne({token:refreshToken});
    if(!isExist){
        res.clearCookie("refreshToken");
        return res.status(400).json({error:"Invalid token requested"});
    }
    try{
        const accessTokenPayload=jwt.verify(accessToken,process.env.SECRET_KEY);
        // console.log("inside auth middleware ",accessTokenPayload)
        if(accessTokenPayload.type==="refreshToken"){
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return res.status(400).json({error:"Invalid token requested"});
        }
        const isUserExist=await user.findOne({_id:accessTokenPayload._id})
        if(!isUserExist){
            console.log(isUserExist);
            return res.status(401).json({message:"Unauthorized,Invalid token requested"})

        }
        req.user=isUserExist;
        return next()
    }
    catch(e){
        console.log(e);
        res.status(401).json({message:"Unauthorized,Invalid token requested"});
    }
     


}