import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import userModel from "../../DB/model/User.model.js";
import { sendEmail } from "../email/send.email.js";
import { verifyAccountTemplate } from "../templates/verifyAccount.template.js";

export const emailEvent=new EventEmitter()
emailEvent.on("sendConfirmEmail",async(data)=>{
const{email}=data
const otp=customAlphabet("0123456789",4)()
const hahOTP=generateHash({plainText:otp})
const html=verifyAccountTemplate({code:otp})
await userModel.updateOne({email},{confirmEmailOTP:hahOTP,tryOfResendCode:5,lastResendAttempt:Date.now()})

await sendEmail({to:email,subject:"confirm email" ,html})
})

emailEvent.on("resendCode",async(data)=>{
    const{email,tryOfResendCode}=data
    const otp=customAlphabet("0123456789",4)()
    const hahOTP=generateHash({plainText:otp})
    const html=verifyAccountTemplate({code:otp})
    await userModel.updateOne({email},{confirmEmailOTP:hahOTP,tryOfResendCode:tryOfResendCode-1,lastResendAttempt:Date.now()})
    
    await sendEmail({to:email,subject:"confirm email" ,html})
    })