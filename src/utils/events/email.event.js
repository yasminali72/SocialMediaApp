import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import { sendEmail } from "../email/send.email.js";
import { verifyAccountTemplate } from "../templates/verifyAccount.template.js";
import { userInfo } from "node:os";
import userModel from "../../DB/model/User.model.js";

export const emailEvent=new EventEmitter()
emailEvent.on("sendConfirmEmail",async(data)=>{
    const{email,type,subject,user}=data
    const otp=customAlphabet("0123456789",4)()
    const hahOTP=generateHash({plainText:otp})
    const html=verifyAccountTemplate({code:otp})
   if (user.confirmEmail && type=="confirmEmail") {
    user.OTP[0].code=hahOTP
    await user.save()
   }
else{
    user.OTP.push({type:type,code:hahOTP,tryOfResendCode:0,expiresIn:Date.now()})
    await user.save()

}    
    await sendEmail({to:email,subject ,html})
    })
    
    let i;
    emailEvent.on("resendCode",async(data)=>{
        const{email,tryOfResendCode,user,type,subject}=data
        const otp=customAlphabet("0123456789",4)()
        const hahOTP=generateHash({plainText:otp})
        const html=verifyAccountTemplate({code:otp})
    
    
       switch (type) {
        case 'confirmEmail':
            i=0
            break;
       case 'forgetPassword':
        i=1
        break;
        default:
            break;
       }
       user.OTP[i].code=hahOTP
       user.OTP[i].tryOfResendCode=tryOfResendCode+1
       user.OTP[i].expiresIn=Date.now()
       await user.save()   
    
        await sendEmail({to:email,subject ,html})
        })

        emailEvent.on("updateEmail",async(data)=>{
            const{email,user}=data
            const otp=customAlphabet("0123456789",4)()
            const hahOTP=generateHash({plainText:otp})
            const html=verifyAccountTemplate({code:otp})
            await userModel.findByIdAndUpdate(user._id,{tempEmailOTP:hahOTP})
            await sendEmail({to:email,subject:"update email" ,html})

            })