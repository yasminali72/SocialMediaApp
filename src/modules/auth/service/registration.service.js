import userModel from "../../../DB/model/User.model.js"
import { emailEvent } from "../../../utils/events/email.event.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import { sucessResponse } from "../../../utils/response/sucess.response.js"
import { generateEncryption } from "../../../utils/security/encryption.js"
import { compareHash, generateHash } from "../../../utils/security/hash.security.js"


// sign up
export const signup = asyncHandler(async(req, res, next) => {
  
    const {email,password,userName,phone,gender}=req.body
    if (await userModel.findOne({email})) {
      return next(new Error("email is exist"))

    }
    const hashPassword=generateHash({plainText:password})
    const encryptPhone=generateEncryption({plainText:phone})
    const user=await userModel.create({email,userName,password:hashPassword,phone:encryptPhone,gender})
    
    emailEvent.emit("sendConfirmEmail",{email,type:"confirmEmail",subject:"confirm email",user})
    return sucessResponse({res,message:"SignUp",data:201,data:{user}})
   
})

// confirm email
export const confirmEmail = asyncHandler(async(req, res, next) => {
  
  const {code,email}=req.body
  const user=await userModel.findOne({email})
  const now = new Date();
  const expiresIn = user?.OTP[0]?.expiresIn || new Date(0); // في أول مرة يكون 0
  const timeDifference = (now - expiresIn) / (1000 * 60); // تحويل الفرق إلى دقائق
  if (!user) {
    return next(new Error("in-valid account",{cause:404}))

  }
  if (user.confirmEmail) {
    return next(new Error("account is already verified",{cause:409}))
  }
if (user.OTP[0].type==="confirmEmail") {
   
  if (!compareHash({plainText:code,hashValue:user.OTP[0].code})) {
     return next(new Error("in-valid code",{cause:400}))
   }
  if (timeDifference<=10) {
  user.confirmEmail=true
  user.OTP[0].tryOfResendCode=5
  user.OTP[0].code=""
 await user.save()
   return sucessResponse({res,message:"account is verify"})
  }
}
return next(new Error("code is expired "))
}) 



// resend code
export const resendCode=asyncHandler(async(req,res,next)=>{
  const {email}=req.body
  const {type}=req.query
  const user=await userModel.findOne({email})

  const now = new Date();
  
  if (user) {
 if (type=="confirmEmail") {
  const expiresIn = user?.OTP[0]?.expiresIn || new Date(0); 
  const timeDifference = (now - expiresIn) / (1000 * 60); 
  if (!user.confirmEmail) {
     if (timeDifference>2) {
       if (user.OTP[0].tryOfResendCode<5) {
         emailEvent.emit("resendCode",{email,tryOfResendCode:user.OTP[0].tryOfResendCode,user,type,subject:"confirm Email"})
         
     return sucessResponse({res,message:"code is sent"})
       }

       if (user.OTP[0].tryOfResendCode==5&&timeDifference>=5) {
        emailEvent.emit("resendCode",{email,tryOfResendCode:0,user,type,subject:"confirm Email"})
         
        return sucessResponse({res,message:"code is sent"})
       }
       return next(new Error(`Please wait ${Math.ceil(5 - timeDifference)} minute(s) before retrying`, { cause: 429 }));

      }
     
      return next(new Error(`Please wait ${Math.ceil(2 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
     
       
   }
   return next(new Error("account is already verified",{cause:400}))
 }

 if (type=="forgetPassword") {
  const expiresIn = user?.OTP[1]?.expiresIn || new Date(0); 
  const timeDifference = (now - expiresIn) / (1000 * 60); 
  if(user.confirmEmail){
     if (user.isForgetPassword) {
        if (timeDifference>2) {
           if (user.OTP[1]?.tryOfResendCode<5) {
             emailEvent.emit("resendCode",{email,tryOfResendCode:user.OTP[1]?.tryOfResendCode,user,type,subject:"forget Password"})
             
         return sucessResponse({res,message:"code is sent"})
           }
  
           if (user.OTP[1].tryOfResendCode==5&&timeDifference>=5) {
              emailEvent.emit("resendCode",{email,tryOfResendCode:0,user,type,subject:"confirm Email"})
               
              return sucessResponse({res,message:"code is sent"})
             }
             return next(new Error(`Please wait ${Math.ceil(5 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
                }
         
          return next(new Error(`Please wait ${Math.ceil(2 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
         
  
     }

     return next(new Error("send request of forgetPassword ,first"))
  }
  return next (new Error("your email is not confrimed , please confirm first "))
 }
  }

  return next(new Error("in-valid account",{cause:404}))
  })



