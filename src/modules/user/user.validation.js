import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"
export const updateProfile=joi.object().keys({
    phone:generalFields.phone, userName:generalFields.userName 
}).required()

export const shareprofile=joi.object().keys({
    userId:generalFields.id.required()
}).required()