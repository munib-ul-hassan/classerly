const StudentModel = require('../models/student');
const ApiError = require('../utils/Apierror');
const  asyncHandler = require ('../utils/asyncHandler');
const ApiResponse=require('../utils/ApiResponse.js')
const jwt=require('jsonwebtoken');
const sendEmail = require('../utils/sendemail.js');
const generateOTP = require('../utils/generateotp.js');


const options={
   httpOnly:true,
   secure:true
}

const generateAccessAndRefreshToken=async(studentId)=>{
 
   try {
        const student=await StudentModel.findById(studentId);
    
        const accessToken=student.generateAccessToken();
         console.log("acesstoken generate",accessToken);
        const refreshToken=student.generateRefreshToken();
        
        student.refreshToken=refreshToken;
        await student.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
     
      
   } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refreshToken and accessToken")
   }
}

exports.registerStudent=asyncHandler(async(req,res)=>{
     const {fullname,username,password,emailaddress,fulladdress,grade}=req.body;
     if(
        [fullname,username,password,emailaddress,fulladdress,grade].some((feild)=>
            feild?.trim()===""
        )
     ){
        throw new ApiError(400,'All fields are required')
     }else if(emailaddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailaddress)){
        throw new ApiError(400,'invalid email address')
     }
    
     const existuser= await StudentModel.findOne({
        $or:[{emailaddress},{username}]
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
        grade
       
     })
     const createdstudent=await StudentModel.findById(student._id).select(
        "-refreshToken -password"
     )
     if(!createdstudent){
        throw new ApiError(500,'something went wrong in creating student')
     }
    res.status(201).json(
      new ApiResponse(200,createdstudent,"student account created Successfully")
    )
})

exports.loginstudent=asyncHandler(async(req,res)=>{
   const {username,emailaddress,password}=req.body;

   if(!username && !emailaddress){
      throw new ApiError(400,"username or passsword is required")
   }
    const studentexist= await StudentModel.findOne({
      $or:[{username},{emailaddress}]
    })
    if(!studentexist){
      throw new ApiError(404,"user does not exist")
    }

   const isPasswordValid= await studentexist.isPasswordCorrect(password)
      if (!isPasswordValid) {
         throw new ApiError(401,"invalid user credentials")
         
      }

   const{accessToken,refreshToken}=await generateAccessAndRefreshToken(studentexist._id);
   const studentloggedIn=await StudentModel.findById(studentexist._id).select("-password -refreshToken")
    
 
   return res
   .status(200)
    .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken)
   .json(
      new ApiResponse(
         200,
         {
            user: studentloggedIn,accessToken,refreshToken
         },
         "user loggedin Succesffully"
          
      )
   )

})

exports.logoutstudent=asyncHandler(async(req,res)=>{
  await StudentModel.findByIdAndUpdate(
   
       req.student._id,
      {
         $unset:{
            refreshToken: 1
         }

   },{
      new:true
   }
)

 return res
 .status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(
   new ApiResponse (200,{},"student logout Successffully")
 )
})

exports.refreshAccessToken=asyncHandler(async(req,res)=>{
 try {
     const incomingRefeshToken=req.cookies.refreshToken || req.body.refreshToken;
     if(!incomingRefeshToken){
        throw ApiError(401,"unathorized access")
     }
     const decodedToken=jwt.verify(incomingRefeshToken,process.env.REFRESH_TOKEN_SECRET);
     const student=StudentModel.findById(decodedToken?._id);
     if(!student){
        throw ApiError(401,"invalid refresh token")
     }
     if(incomingRefeshToken !== StudentModel.refreshToken){
        throw ApiError(401,"refresh token is experied and used")
        
     }
     const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(student._id)
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
        new ApiResponse(
           200,
           {accessToken,refreshToken:newrefreshToken}
        )
     )
 } catch (error) {
   throw new ApiError(500,error?.message || "something went wrong in creating newrefeshtoken")
   
 }
})


exports.forgetPasswordstudent=asyncHandler(async(req,res)=>{
   console.log(req.body);
     const {emailaddress}=req.body;

     try {
         const findStudent=await StudentModel.findOne({emailaddress});
         if(!findStudent){
            throw new ApiError(404,"user not exist");
         }
         const otp=generateOTP();
        findStudent.forgetPasswordOtp=otp;
        findStudent.forgetPasswordOtpExpiry= Date.now() + 120000;
        findStudent.save();
          const requesttype="You have requested to reset your password. Please use the following OTP to proceed:"
          const requestvalidefor="This OTP is valid for a 2 minutes. Do not share it with anyone.";
          await sendEmail(findStudent.emailaddress,otp,requesttype,requestvalidefor);
          const options={
            httpOnly:true,
            secure:true
         }
         return res
         .status(200)
         .cookie("forgetpasswordemail",{emailaddress:findStudent.emailaddress},options)
         .json(
            new ApiResponse (200,{},"OTP sended Successffully")
         ) 
     } catch (error) {
      throw new ApiError(500,"something went wrong");
     }
})

exports.verifyOtp=asyncHandler(async(req,res)=>{
   const {otp}=req.body;
   const emailaddress=req.cookies.forgetpasswordemail || req.body.emailaddress;
   try {
      const findstudent=await StudentModel.findOne(emailaddress);
      if(!findstudent){
         throw new ApiError(404,"user not found")
      }
     
      if(findstudent.forgetPasswordOtp !== otp || findstudent.forgetPasswordOtpExpiry < Date.now()){
         throw new ApiError(401,"invalid or expired Otp")
      }
      return res.status(200).json(new ApiResponse(200, "OTP verification successful"));
   } catch (error) {
      throw new ApiError(500,error?.message || "something went wrong")
   }
})

exports.resetPassword=asyncHandler(async(req,res)=>{
   const {newpassword}=req.body;
   const emailaddress=req.cookies.forgetpasswordemail || req.body.emailaddress;
   try {
        const findstudent=await StudentModel.findOne(emailaddress);
        if(!findstudent){
         throw new ApiError(404,"user not exist")
        }
        findstudent.password=newpassword;
       await findstudent.save();
       const message="your password changed successfuly";
       const requesttype="you have request to go to login page and login to your acccount"
        await sendEmail(findstudent.emailaddress,message,requesttype)
       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("resfreshToken",options)
       .json(
         new ApiResponse(200,{},"password changed succesfuly")
       )

   } catch (error) {
      
   }
})