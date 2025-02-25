import mongoose, { Schema, model } from "mongoose";
export const genderTypes = { male: "male", female: "female" };
export const roleTypes = { user: "user", admin: "admin" };
export const providerTypes={google:"Google",system:"System"}
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
 
    password: {
      type: String,
      required: (data)=>{
        console.log(data);
        return data?.provider === providerTypes.google? false :true
      },
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
    isForgetPassword:{type:Boolean,
      default:false},
      isverifyCode:{type:Boolean,
        default:false},
    changeCridentialsTime:Date,
    OTP: [{
      code:String,
      type:{
type:String,
enum:["confirmEmail","forgetPassword"]
      },
      tryOfResendCode:Number,
      expiresIn:Date,
      
    }],
    provider:{
      type:String,
      enum: Object.values(providerTypes),
      default:providerTypes.system
    }
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
