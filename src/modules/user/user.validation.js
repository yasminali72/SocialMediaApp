import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"
export const updateProfile=joi.object().keys({
    phone:generalFields.phone, userName:generalFields.userName ,
    DOB:generalFields.DOB,
    gender:generalFields.gender,
    address:generalFields.address

}).required()

export const shareprofile=joi.object().keys({
    userId:generalFields.id.required()
}).required()

export const updateEmail=joi.object().keys({
    email:generalFields.email.required()
}).required()

export const resetEmail=joi.object().keys({
    oldCode:generalFields.code.required(),
    newCode:generalFields.code.required()
}).required()

export const updatePassword=joi.object().keys({
    oldPassword:generalFields.password.required(),
    newPassword:generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmationPassword:generalFields.confirmationPassword.valid(joi.ref("newPassword")).required()
}).required()