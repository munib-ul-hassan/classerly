const StudentModel = require('../../models/StudentModel/student.js');
const ApiError = require('../../utils/Apierror.js');
const  asyncHandler = require ('../../utils/asyncHandler.js');
const ApiResponse=require('../../utils/ApiResponse.js')
const jwt=require('jsonwebtoken');
const sendEmail = require('../../utils/sendemail.js');



const options={
   httpOnly:true,
   secure:true
}

const generateAccessAndRefreshToken=async(studentId)=>{
 
   try {
        const student=await StudentModel.findById(studentId);
    
        const accessToken=student.generateAccessToken();
       
        const refreshToken=student.generateRefreshToken();
        
        student.refreshToken=refreshToken;
        await student.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
     
      
   } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refreshToken and accessToken")
   }
}

exports.registerStudent = asyncHandler(async (req, res) => {
   try {
       const { fullname, username, password, emailaddress, fulladdress, grade } = req.body;

       if ([fullname, username, password, emailaddress, fulladdress, grade].some(field => !field || field.trim() === "")) {
           throw new ApiError(400, 'All fields are required');
       } else if (emailaddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailaddress)) {
           throw new ApiError(400, 'Invalid email address');
       }

       const existUser = await StudentModel.findOne({ $or: [{ emailaddress }, { username: username.toLowerCase() }] });
       if (existUser) {
           throw new ApiError(409, 'User already exists');
       }

       const generateId = () => {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
      };

      const stdid=generateId();
       

       const student = await StudentModel.create({
           fullname,
           username: username.toLowerCase(),
           emailaddress,
           fulladdress,
           password,
           grade,
           stdid
       });

       if (!student) {
           throw new ApiError(500, 'Something went wrong in creating student');
       }

       const createdStudent = await StudentModel.findById(student._id).select("-refreshToken -password");

       if (!createdStudent) {
           throw new ApiError(500, 'Something went wrong in creating student');
       }

       // Send email after response is sent
       const emailsubject = "Student Registration";
       const email = emailaddress;
       const message = `You are registered successfully. Your student ID is ${student.stdid}.`
       const requestType = "Your request for student registration is done"
       await sendEmail(emailsubject, email, message, requestType);

       // Send response to the client
       res.status(201).json(new ApiResponse(200, createdStudent, "Student account created successfully"));
   } catch (error) {
       const errorMessage = error.message || "Something went wrong";
       return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
   }
});










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
  
   
 }
})




