import jwt from "jsonwebtoken"

export const generateToken=({payload={},signature=process.env.USER_ACCESS_TOKEN,expiresIn=process.env.EXPIRESIN}={})=>{
    const token=jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)})
    return token
}

export const verifyToken=({token={},signature=process.env.USER_ACCESS_TOKEN}={})=>{
    const decoded=jwt.verify(token,signature )
    return decoded
}