import userModel, { roleTypes } from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";
import {  generatedecryption } from "../../../utils/security/encryption.js";
import { compareHash } from "../../../utils/security/hash.security.js";
import { generateToken } from "../../../utils/security/token.security.js";

export const login=asyncHandler(async(req,res,next)=>{
const {email,password}=req.body
const user=await userModel.findOne({email})
if (!user) {
    return next(new Error("in-valid data",{cause:404}))
}
if (!user.confirmEmail) {
    return next(new Error("please confirm your email first",{cause:409}))
}
if (!compareHash({plainText:password,hashValue:user.password})) {
    return next(new Error("your password is not correct ",{cause:404}))

}
user.phone=generatedecryption({caipherText:user.phone})
const access_token=generateToken({payload:{id:user._id},
signature:user.role===roleTypes.admin?process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN
})
const refresh_token=generateToken({payload:{id:user._id},
    signature:user.role===roleTypes.admin?process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,expiresIn:31536000
    })
return sucessResponse({res,message:"Login",data:{access_token,refresh_token}})
})