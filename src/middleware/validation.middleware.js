import joi from 'joi'

export const generalFields={
    userName:joi.string().min(2).max(50).trim(),
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:3,tlds:{allow:['com','net']}}),
password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/)),
confirmationPassword:joi.string().valid(joi.ref("password")),
phone:joi.string().pattern(new RegExp(/^\+?(1|20|44|49|91|971|966|33|34|39|86|81|55|27)\d{9}$/)),
code:joi.string().pattern(new RegExp(/^\d{4}$/))
}

export const validation=(Schema)=>{
    return (req,res,next)=>{
const inputs={...req.body,...req.query ,...req.params}
const validationResualts=Schema.validate(inputs,{abortEarly:false})
console.log(validationResualts);
if (validationResualts.error) {
    return res.status(400).json({message:"validation error",details:validationResualts.error.details})
}
return next()
    }
}