import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup=joi.object().keys({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
password:generalFields.password.required(),
confirmationPassword:generalFields.confirmationPassword.required(),
phone:generalFields.phone.required(),
gender:joi.string().valid("female","male")
}).required()

export const confirmEmail=joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required()
}).required()

export const login=joi.object().keys({
    email:generalFields.email.required(),
    password:generalFields.password.required()
}).required()

export const resendCode=joi.object().keys({
    email:generalFields.email.required()
}).required()