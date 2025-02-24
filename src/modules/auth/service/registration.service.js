import userModel from "../../../DB/model/User.model.js"
import { emailEvent } from "../../../utils/events/email.event.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import { sucessResponse } from "../../../utils/response/sucess.response.js"
import { generateEncryption } from "../../../utils/security/encryption.js"
import { compareHash, generateHash } from "../../../utils/security/hash.security.js"



export const signup = asyncHandler(async(req, res, next) => {
  
    const {email,password,userName,phone,gender}=req.body
    if (await userModel.findOne({email})) {
      return next(new Error("email is exist"))

    }
    const hashPassword=generateHash({plainText:password})
    const encryptPhone=generateEncryption({plainText:phone})
    const user=await userModel.create({email,userName,password:hashPassword,phone:encryptPhone,gender})
    
   emailEvent.emit("sendConfirmEmail",{email})
      return sucessResponse({res,message:"SignUp",data:201,data:{user}})
   
})

export const confirmEmail = asyncHandler(async(req, res, next) => {
  
  const {code,email}=req.body
  const user=await userModel.findOne({email})
  const now = new Date();
  const lastAttempt = user.lastResendAttempt || new Date(0); // في أول مرة يكون 0
  const timeDifference = (now - lastAttempt) / (1000 * 60); // تحويل الفرق إلى دقائق
  if (!user) {
    return next(new Error("in-valid account",{cause:404}))

  }
  if (user.confirmEmail) {
    return next(new Error("account is already verified",{cause:409}))
  }

  if (!compareHash({plainText:code,hashValue:user.confirmEmailOTP})) {
    return next(new Error("in-valid code",{cause:400}))
  }
 if (timeDifference<5) {
  await userModel.findOneAndUpdate({email},{confirmEmail:true,$unset:{confirmEmailOTP:"",tryOfResendCode:5,lastResendAttempt:0}})
  return sucessResponse({res,message:"account is verify"})
 }
return next(new Error("code is expired "))
}) 





export const resendCode=asyncHandler(async(req,res,next)=>{
const {email}=req.body
const user=await userModel.findOne({email})
const now = new Date();
  const lastAttempt = user?.lastResendAttempt || new Date(0); // في أول مرة يكون 0
  const timeDifference = (now - lastAttempt) / (1000 * 60); // تحويل الفرق إلى دقائق
if (user) {
if (!user.confirmEmail) {
  if (timeDifference>2) {
    if (user.tryOfResendCode>0) {
      emailEvent.emit("resendCode",{email,tryOfResendCode:user.tryOfResendCode})
      
  return sucessResponse({res,message:"code is sent"})
    }
   
    if (user.tryOfResendCode==0 &&timeDifference>=5) {
      
        emailEvent.emit("resendCode",{email,tryOfResendCode:6})
        return sucessResponse({res,message:"code is sent"})

      

    }
   return next(new Error(`Please wait ${Math.ceil(5 - timeDifference)} minute(s) before retrying`, { cause: 429 }));

   }
  
   return next(new Error(`Please wait ${Math.ceil(2 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
  
    
}
return next(new Error("account is already verified",{cause:400}))
}
return next(new Error("in-valid account",{cause:404}))
})

