import { Router } from "express";

import * as userService from "./services/user.services.js"
import { authentication } from "../../middleware/auth.middleware.js";
import * as validators from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";

const router=Router()

router.get("/profile",authentication(),userService.profile)
router.get("/profile/:userId",validation(validators.shareprofile),authentication(),userService.shareProfile)


export default router