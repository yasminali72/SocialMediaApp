import postModel from "../../../DB/model/Post.model.js";
import { roleTypes } from "../../../DB/model/User.model.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";

// get all post
export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await postModel
  .find({ isDeleted: false })
  .sort({ createdAt: -1 })
  .populate("createdBy", "userName profilePic")
  .populate("likes", "userName profilePic")
  .populate("tags", "userName profilePic");


  return sucessResponse({ res,message:"all posts", status: 200, data: { post: posts } });
});

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

  const owner =
    req.user.role === roleTypes.admin ? {} : { createdBy: req.user._id };
  const post = await postModel.findOneAndUpdate(
    { _id: postId, isDeleted: false, ...owner },
    {
      isDeleted: true,
      updatedBy: req.user._id,
      deletedBy: req.user._id,
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
    { _id: postId, isDeleted: true, deletedBy: req.user._id },
    {
      isDeleted: false,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  return post
    ? sucessResponse({ res, status: 200, data: { post } })
    : next(new Error("post not found", { cause: 404 }));
});

// like && unlike post
export const toggleLikePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postModel.findById(postId);
  if (!post || post.isDeleted) {
    return next(new Error("Post not found", { cause: 404 }));
  }

  let updateQuery = {};
  const userId = req.user._id;

  if (post.likes.includes(userId)) {
    // المستخدم عمل لايك قبل كده → شيله
    updateQuery = { $pull: { likes: userId } };
  } else {
    // المستخدم لسه ماعملش لايك → ضيفه
    updateQuery = { $addToSet: { likes: userId } };
  }

  const updatedPost = await postModel.findByIdAndUpdate(postId, updateQuery, {
    new: true,
  });

  return sucessResponse({ res, status: 200, data: { post: updatedPost } });
});
