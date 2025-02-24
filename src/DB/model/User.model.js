import mongoose, { Schema, model } from "mongoose";
export const genderTypes = { male: "male", female: "female" };
export const roleTypes = { user: "user", admin: "admin" };
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minLength: 2,
      maxLength: 50,
      trim: true,
    
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email exist"],
    },
    confirmEmailOTP:String,
    password: {
      type: String,
      required: [true, "password is required"],
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    phone: String,
    address: String,
    image: String,
    coverImage: [String],
    DOB: Date,

    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted:{type:Boolean,default:false},
    changeCridentialsTime:Date,
    tryOfResendCode:Number,
    lastResendAttempt:Date
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
