
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as registrationService from './service/registration.service.js';
import * as validators from './auth.validation.js'
import { validation } from '../../middleware/validation.middleware.js';
import { login } from './service/login.service.js';
const router = Router();


router.post("/signup", validation(validators.signup),registrationService.signup)
router.post("/login", validation(validators.login),login)

router.patch("/confirm-email", validation(validators.confirmEmail),registrationService.confirmEmail)
router.patch("/resend-code", validation(validators.resendCode),registrationService.resendCode)



export default router