const StudentModel = require('../models/student');
const ApiError = require('../utils/Apierror');
const  asyncHandler = require ('../utils/asyncHandler');
const ApiResponse=require('../utils/ApiResponse')

exports.registerStudent=asyncHandler(async(req,res)=>{
     const {fullname,username,password,emailaddress,fulladdress}=req.body;
     if(
        [fullname,username,password,emailaddress,fulladdress].some((feild)=>
            feild?.trim()===""
        )
     ){
        throw new ApiError(400,'All fields are required')
     }else if(emailaddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailaddress)){
        throw new ApiError(400,'invalid email address')
     }
    
     const existuser= await StudentModel.findOne({
        $or:[{username},{emailaddress}]
     })
     if(existuser){
        throw new ApiError (409,'user already exist')
     }
  
     const student=await StudentModel.create({
        fullname,
        username:username.toLowerCase(),
        emailaddress,
        fulladdress,
        password,
       
     })
     const createdstudent=await StudentModel.findById(student._id).select(
        "-refreshtoken -password"
     )
     if(!createdstudent){
        throw new ApiError(500,'something went wrong in creating student')
     }
    res.status(201).json(
      new ApiResponse(200,createdstudent,"student account created Successfully")
    )
})

exports.loginstudent=asyncHandler(async(req,res)=>{

})
