import { populate } from "dotenv"
import userModel from "../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import { sucessResponse } from "../../../utils/response/sucess.response.js"
import { generatedecryption } from "../../../utils/security/encryption.js"

export const profile=asyncHandler(async(req,res,next)=>{
    const user=await userModel.findOne({_id:req.user._id}).populate("viewers.userId","userName email coverImage");
return sucessResponse({res,data:{user}})
})
export const shareProfile=asyncHandler(async(req,res,next)=>{

 const{userId}=req.params
 if (userId==req.user._id.toString()) {
    const user=req.user
    return sucessResponse({res,data:user})
 }
 const user=await userModel.findOneAndUpdate({_id:userId,isDeleted:false,"viewers.userId":req.user._id},{$push:{"viewers.$.visitedAt":{ $each: [Date.now()], $slice: -5 }}},{new:true}).select("userName email coverImage")
 if (user) {
   
    return sucessResponse({res,data:{user}})
 }
  const newUser=await userModel.findOneAndUpdate({_id:userId,isDeleted:false},{$push:{viewers:{userId:req.user._id,visitedAt:[Date.now()]}}},{new:true}).select("userName coverImage email")

 if (newUser) {
    return sucessResponse({res,data:{user}})
 }
return next(new Error("user not found",{cause:404}))
    })