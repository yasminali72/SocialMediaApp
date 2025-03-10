import { Router } from "express";

import * as userService from "./services/user.services.js"
import { authentication } from "../../middleware/auth.middleware.js";
import * as validators from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";

const router=Router()

router.get("/profile",authentication(),userService.profile)
router.patch("/profile",validation(validators.updateProfile),authentication(),userService.updateProfile)

router.get("/profile/:userId",validation(validators.shareprofile),authentication(),userService.shareProfile)
router.patch("/profile/update-email",validation(validators.updateEmail),authentication(),userService.updateEmail)

router.patch("/profile/reset-email",validation(validators.resetEmail),authentication(),userService.restEmail)
router.patch("/profile/update-password",validation(validators.updatePassword),authentication(),userService.updatePassword)

router.delete("/profile",authentication(),userService.deleteAccount)
router.patch("/unfreezeProfile",validation(validators.unfreezeAccount),userService.unfreezeAccount)

export default router