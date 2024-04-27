const StudentModel = require('../models/student');
const ApiError = require('../utils/Apierror');
 const jwt=require('jsonwebtoken');
const asyncHandler=require('../utils/asyncHandler.js')

const verfiyJWT= asyncHandler(async(req,_,next)=>{
   try {
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

     if(!token){
         throw new ApiError(401,"Unauthorized Access")
     }
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const student=await StudentModel.findById(decodedToken?._id).select(
     "-password -refreshtoken"
    )
    if(!student){
     throw new ApiError(401,"Invalid Access Token")
    }
    req.student=student;
    next();
   } catch (error) {
     throw new ApiError(401,error?.message || " Invalid access Token")
   }
})
module.exports=verfiyJWT;