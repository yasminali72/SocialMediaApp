import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.required(),
    phone: generalFields.phone.required(),
    gender: generalFields.gender,
    address: generalFields.address,
    DOB: generalFields.DOB,
  })
  .required();

export const confirmEmail = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    code: generalFields.code.required(),
  })
  .required();

export const login = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .required();
export const loginWithPhone = joi
  .object()
  .keys({
    phone: generalFields.phone.required(),
    password: generalFields.password.required(),
  })
  .required();

export const resendCode = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    type: joi.string().valid("confirmEmail", "forgetPassword").required(),
  })
  .required();
export const forgetPasword = joi
  .object()
  .keys({
    email: generalFields.email.required(),
  })
  .required();

export const verifyCode = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    code: generalFields.code.required(),
  })
  .required();

export const resetPassword = joi
  .object()
  .keys({
    email: generalFields.email.required(),
    newPassword: generalFields.password.required(),
    conformationPassword: generalFields.confirmationPassword
      .valid(joi.ref("newPassword"))
      .required(),
  })
  .required();
