import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";
import { generateEncryption } from "../../../utils/security/encryption.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";

// profile
export const profile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ _id: req.user._id })
    .populate("viewers.userId", "userName email coverImage");
  return sucessResponse({ res, data: { user } });
});
// share profile
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId == req.user._id.toString()) {
    const user = req.user;
    return sucessResponse({ res, data: user });
  }
  const user = await userModel
    .findOneAndUpdate(
      { _id: userId, isDeleted: false, "viewers.userId": req.user._id },
      { $push: { "viewers.$.visitedAt": { $each: [Date.now()], $slice: -5 } } },
      { new: true }
    )
    .select("userName email coverImage");
  if (user) {
    return sucessResponse({ res, data: { user } });
  }
  const newUser = await userModel
    .findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $push: { viewers: { userId: req.user._id, visitedAt: [Date.now()] } } },
      { new: true }
    )
    .select("userName coverImage email");

  if (newUser) {
    return sucessResponse({ res, data: { user } });
  }
  return next(new Error("user not found", { cause: 404 }));
});
// update email
export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (await userModel.findOne({ email })) {
    return next(new Error("email is exists", { cause: 409 }));
  }
  await userModel.updateOne({ _id: req.user._id }, { tempEmail: email });
  emailEvent.emit("sendConfirmEmail", {
    email: req.user.email,
    user: req.user,
    type: "confirmEmail",
    subject: "confirmEmail",
  });
  emailEvent.emit("updateEmail", { email, user: req.user });
  return sucessResponse({ res, message: "code is sent" });
});

export const restEmail = asyncHandler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (
    !compareHash({ plainText: oldCode, hashValue: req.user.OTP[0].code }) ||
    !compareHash({ plainText: newCode, hashValue: req.user.tempEmailOTP })
  ) {
    return next(new Error(" code is not correct"));
  }
  await userModel.findByIdAndUpdate(req.user._id, {
    email: req.user.tempEmail,changeCredentialTime:Date.now(),
    $unset: { tempEmail: "", tempEmailOTP: "" },
  });
  return sucessResponse({ res, message: "email is updated" });
});
// update password
export const updatePassword=asyncHandler(async(req,res,next)=>{

   const {oldPassword,newPassword}=req.body
if (!compareHash({plainText:oldPassword,hashValue:req.user.password})) {
  return next (new Error("in-valid old password"))
}
await userModel.findByIdAndUpdate(req.user._id,{password:generateHash({plainText:newPassword}),changeCredentialTime:Date.now()})  
return sucessResponse({res,message:"password is updated"})
})
// update Profile
export const updateProfile=asyncHandler(async(req,res,next)=>{
  const {userName,phone,gender,DOB,address}=req.body
 const user= await userModel.findByIdAndUpdate(req.user._id,{userName,phone:generateEncryption({plainText:phone}),gender,DOB,address},{new:true})
  return sucessResponse({res,message:"profile is updated",data:{user}})


})
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true, changeCredentialTime: Date.now(),deletedAt:Date.now() },
    { new: true }
  );
  return sucessResponse({ res, message: "Account is freezed" });
});

export const unfreezeAccount = asyncHandler(async (req, res, next) => {
 const {email} =req.body
  const user = await userModel.findOneAndUpdate(
    {
      email
    },
    { isDeleted: false }
  );
  if (!user) {
    return next(new Error("email is not registered before"));
  }
  return sucessResponse({ res, message: "Account is Active Now" });
});


