

import expressAsyncHandler from "express-async-handler";
import jwt  from "jsonwebtoken";
import User from "../models/Usermodel.js";


const verifyJwt = expressAsyncHandler(async(req, _, next)=>{
  try {
    const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
    if(!token){
        throw new Error(401, "unauthorized request")
    }
 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user =  await User.findById(decodedToken.id).select("-password ")

     if(!user){
        throw new Error(402, "invalid access Token")
     }
     req.user = user
     next()
  } catch (error) {
    throw new Error(403, error?.message || "invalid access Token")
  }
   
}) 
export {verifyJwt}