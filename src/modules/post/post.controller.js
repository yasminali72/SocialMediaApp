import { Router } from "express";
import * as postSerivce from "./service/post.service.js";
import * as validators from "./post.validation.js";
import { endPoint } from "./post.authorization.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import {
  fileValidations,
  uploadCloudFile,
} from "../../utils/multer/cloud.multer.js";
const router = Router();
// create post
router.post(
  "/",
  authentication(),
  authorization(endPoint.createPost),
  uploadCloudFile(fileValidations.image).array("attachment", 20),
  validation(validators.createPost),
  postSerivce.createPost
);
// get all post
router.get(
  "/",
  authentication(),
  postSerivce.getPosts
);
router.patch(
  "/:postId",
  authentication(),
  authorization(endPoint.createPost),
  uploadCloudFile(fileValidations.image).array("attachment", 20),
  validation(validators.updatePost),
  postSerivce.updatePost
);
// soft delete
router.delete(
  "/:postId",
  authentication(),
  authorization(endPoint.freezePost),
  validation(validators.freezePost),
  postSerivce.freezePost
);

router.patch(
  "/:postId/restore",
  authentication(),
  authorization(endPoint.freezePost),
  validation(validators.unFreezePost),
  postSerivce.unFreezePost
);
// like and unlike post
router.patch(
  "/:postId/toggleLikePost",
  authentication(),
  authorization(endPoint.toggleLikePost),
  validation(validators.toggleLikePost),
  postSerivce.toggleLikePost
);




export default router;
