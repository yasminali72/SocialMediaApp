import postModel from "../../../DB/model/Post.model.js";
import { roleTypes } from "../../../DB/model/User.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  let attachments = [];
  for (const file of req.files) {
    console.log(file);

    const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/POST`,
    });
    attachments.push({ secure_url, public_id });
  }
  const post = await postModel.create({
    content,
    attachments,
    createdBy: req.user._id,
  });

  return sucessResponse({ res, status: 201, data: { post } });
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  let attachments = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const { secure_url, public_id } = await cloud.uploader.upload(file.path, {
        folder: `${process.env.APP_NAME}/POST`,
      });

      attachments.push({ secure_url, public_id });
    }
    req.body.attachments = attachments;
  }
  const post = await postModel.findOneAndUpdate(
    { _id: postId, createdBy: req.user._id, isDeleted: false },
    {
      ...req.body,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  return post
    ? sucessResponse({ res, status: 200, data: { post } })
    : next(new Error("post not found", { cause: 404 }));
});

export const freezePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const owner=req.user.role===roleTypes.admin?{}:{createdBy:req.user._id}
  const post = await postModel.findOneAndUpdate(
    { _id: postId, isDeleted: false ,...owner},
    {
     isDeleted:true,
      updatedBy: req.user._id,
      deletedBy:req.user._id,
    },
    { new: true }
  );

  return post
    ? sucessResponse({ res, status: 200, data: { post } })
    : next(new Error("post not found", { cause: 404 }));
});
export const unFreezePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postModel.findOneAndUpdate(
    { _id: postId, isDeleted: true ,deletedBy:req.user._id},
    {
     isDeleted:false,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  return post
    ? sucessResponse({ res, status: 200, data: { post } })
    : next(new Error("post not found", { cause: 404 }));
});
