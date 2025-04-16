import mongoose, { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      minlength: 2,
      maxlength: 50000,
      trim: true,
      required: function () {
        return this.attachments.length ? false : true;
      },
    },

    attachments: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy:{
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  
  },

  { timestamps: true }
);

 const postModel=mongoose.models.Post || model("Post",postSchema)
 export default postModel