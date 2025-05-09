import joi from "joi";
import { genderTypes } from "../DB/model/User.model.js";
import { Types } from "mongoose";

export const isValidObjectId = (value, halper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : halper.message("in-valid object id");
};

const fileObj = {
  fieldname: joi.string().valid("attchment"),
  orignalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  finalPath: joi.string(),
  destination: joi.string(),
  fieldname: joi.string(),
  path: joi.string(),
  size: joi.number(),
};
export const generalFields = {
  userName: joi.string().min(2).max(50).trim(),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net"] },
    }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/)),
  confirmationPassword: joi.string().valid(joi.ref("password")),
  phone: joi
    .string()
    .pattern(
      new RegExp(/^\+?(1|20|44|49|91|971|966|33|34|39|86|81|55|27)\d{9}$/)
    ),
  code: joi.string().pattern(new RegExp(/^\d{4}$/)),
  id: joi.string().custom(isValidObjectId),
  DOB: joi.date().iso().less("now"),
  gender: joi
    .string()
    .valid(...Object.values(genderTypes))
    .default(genderTypes.male),
  address: joi.string(),
  fileObj,
  file:joi.object().keys(fileObj)
};

export const validation = (Schema) => {
  return (req, res, next) => {
    const inputs = { ...req.body, ...req.query, ...req.params };
    const validationResualts = Schema.validate(inputs, { abortEarly: false });
    console.log(validationResualts);
    if (validationResualts.error) {
      return res
        .status(400)
        .json({
          message: "validation error",
          details: validationResualts.error.details,
        });
    }
    return next();
  };
};
