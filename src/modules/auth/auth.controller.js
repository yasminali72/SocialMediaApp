
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as registrationService from './service/registration.service.js';
import * as loginService from './service/login.service.js';

import * as validators from './auth.validation.js'
import { validation } from '../../middleware/validation.middleware.js';
import { login } from './service/login.service.js';
const router = Router();


router.post("/signup", validation(validators.signup),registrationService.signup)
router.post("/login", validation(validators.login),loginService.login)
router.post("/loginWithGoogle", loginService.loginWithGoogle)

router.patch("/confirm-email", validation(validators.confirmEmail),registrationService.confirmEmail)
router.patch("/resend-code", validation(validators.resendCode),registrationService.resendCode)

router.get("/refresh-token", loginService.refreshToken)

router.patch("/forget-password",validation(validators.forgetPasword),loginService.forgetPassword)
router.patch("/verify-code",validation(validators.verifyCode),loginService.verifyCode)
router.patch("/reset-password",validation(validators.resetPassword),loginService.resetPassword)

export default router