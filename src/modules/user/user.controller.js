import { Router } from "express";

import * as userService from "./service/user.service.js"
import { authentication } from "../../middleware/auth.middleware.js";
import * as validators from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { fileValidations, uploadCloudFile } from "../../utils/multer/cloud.multer.js";

const router=Router()

router.get("/profile",authentication(),userService.profile)
router.patch("/profile",validation(validators.updateProfile),authentication(),userService.updateProfile)

router.get("/profile/:userId",validation(validators.shareprofile),authentication(),userService.shareProfile)
router.patch("/profile/update-email",validation(validators.updateEmail),authentication(),userService.updateEmail)

router.patch("/profile/reset-email",validation(validators.resetEmail),authentication(),userService.restEmail)
router.patch("/profile/update-password",validation(validators.updatePassword),authentication(),userService.updatePassword)

router.patch("/profile/upload-image",authentication(),uploadCloudFile(fileValidations.image).single("image"),userService.uploadProfileImage)

router.patch("/profile/upload-image/cover",authentication(),uploadCloudFile(fileValidations.image).array("image"),userService.uploadProfileCoverImage)

router.delete("/profile/delete-image",authentication(),uploadCloudFile(fileValidations.image).single("image"),userService.deleteProfileImage)
router.delete("/profile/delete-image/cover",authentication(),uploadCloudFile(fileValidations.image).single("image"),userService.deleteCoverImage)

router.delete("/profile",authentication(),userService.deleteAccount)
router.patch("/unfreezeProfile",validation(validators.unfreezeAccount),userService.unfreezeAccount)

export default router