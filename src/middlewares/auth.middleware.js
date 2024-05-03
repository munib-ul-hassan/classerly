const StudentModel = require('../models/StudentModel/student.js');
const ApiError = require('../utils/Apierror');
 const jwt=require('jsonwebtoken');
const asyncHandler=require('../utils/asyncHandler.js');
// const ParentModel = require("../../models/ParentModel/parentmodel.js");

const TeacherModel = require('../models/TeacherModel/teachermodel.js');
const ParentModel = require('../models/Parentmodel/parentmodel.js');

const verfiyJWT= asyncHandler(async(req,_,next)=>{
   try {
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

     if(!token){
         throw new ApiError(401,"Unauthorized Access")
     }
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    let usermodel;
    switch(decodedToken.role){
      case "student":
        usermodel=StudentModel;
        break;
        case "parent":
          usermodel=ParentModel;
          break;
          case "teacher":
          usermodel=TeacherModel;
         break;
         default:
         throw new ApiError(401,"Invalid Access Token")
    }
    const userFound=await usermodel.findById(decodedToken?._id).select(
     "-password -refreshtoken"
    )
    if(!userFound){
     throw new ApiError(401,"Invalid Access Token")
    }
    req.userFound=userFound;
    next();
   } catch (error) {
     throw new ApiError(401,error?.message || " Invalid access Token")
   }
})
module.exports=verfiyJWT;