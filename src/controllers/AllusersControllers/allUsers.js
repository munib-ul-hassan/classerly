
// const ParentModel = require("../../models/ParentModel/parentmodel");
const ParentModel = require("../../models/Parentmodel/parentmodel");
const StudentModel = require("../../models/StudentModel/student");
const TeacherModel = require("../../models/TeacherModel/teachermodel");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/Apierror");
const asyncHandler = require("../../utils/asyncHandler");
// const otp=require('../utils/generateotp');
const sendEmail = require("../../utils/sendemail");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  

const options={
    httpOnly:true,
    secure:true
 }
 const generateAccessAndRefreshToken = async (userId, role) => {
    try {
        let UserModel;

        switch (role) {
            case "student":
                UserModel = StudentModel;
                break;
            case "parent":
                UserModel = ParentModel;
                break;
            case "teacher":
                UserModel = TeacherModel;
                break;
            default:
                throw new ApiError(400, "Invalid user role");
        }

        const user = await UserModel.findById(userId);

        const accessToken = user.generateAccessToken();
        console.log("accessToken generated", accessToken);

        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refreshToken and accessToken");
    }
}


 exports.userlogin = asyncHandler(async (req, res) => {
    const { username, emailaddress, password, role } = req.body;

    if (!username && !emailaddress) {
        throw new ApiError(400, "Username or password is required");
    }

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    try {
        let userexist;

        if (role === "student") {
            userexist = await StudentModel.findOne({emailaddress });
        } else if (role === "parent") {
            userexist = await ParentModel.findOne({emailaddress });
        } else if (role === "teacher") {
            userexist = await TeacherModel.findOne({emailaddress });
            
        } else {
            throw new ApiError(404, "User role not recognized");
        }
        if (!userexist) {
            throw new ApiError(404, "User does not exist");
        }
         
        const isPasswordValid = await userexist.isPasswordCorrect(password);
        
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userexist._id,userexist.role);
        const { password: _, grade: __, ...userloggedIn } = userexist.toObject();

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken)
            .json({
                user: userloggedIn,
                accessToken,
                refreshToken,
                message: "User logged in successfully"
            });
    } catch (error) {
      
        return res.status(error.statusCode || 500).json({
            error: {
                message: error.message || "Something went wrong"
            }
        });
    }
});

exports.userlogout=asyncHandler(async(req,res)=>{
    const role=req.userFound.role;
    let UserModel;
    switch(role){
        case "student":
        UserModel = StudentModel;
        break;
        case "parent":
        UserModel=parentModel;
        break;
        case "teacher":
            UserModel=TeacherModel;
            break;
            default:
            throw new ApiError(500,"user role not recognized")

    }

    await UserModel.findByIdAndUpdate(
     
        req.userFound._id,
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
     new ApiResponse(200,{},"student logout Successffully")
   )
  })

  exports.userforgetPassword=asyncHandler(async(req,res)=>{
   
      const {emailaddress,role}=req.body;
       
      try {
        let UserModel;
        switch(role){
            case "student":
                UserModel=StudentModel;
                break;
                case "parent":
                    UserModel=parentModel;
                    break;
                    case "teacher":
                    UserModel=TeacherModel;
                    break
                    default:
                        throw new ApiError(400,"role not recoginzed")
        }

          const finduser=await UserModel.findOne({emailaddress});
          
          if(!finduser){
             throw new ApiError(404,"user not exist");
          }
          const otp=generateOTP();
         
         finduser.forgetPasswordOtp=otp;
         finduser.forgetPasswordOtpExpiry= Date.now() + 120000;
         finduser.save();
         const emailsubject="reset passsword otp"
           const message=`You one time reset password otp is ${otp} This OTP is valid for a 2 minutes. Do not share it with anyone`
        const requestType="Your are requested for reset password"
     
           await sendEmail(emailsubject,finduser.emailaddress,message,requestType);
         
          return res
          .status(200)
          .cookie("forgetpasswordemailrole",{emailaddress:finduser.emailaddress,role:finduser.role},options)
          .json(
             new ApiResponse (200,{},"OTP sended Successffully")
          ) 
      } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
      }
 })

 exports.verifyOtp=asyncHandler(async(req,res)=>{
    const {otp}=req.body;
   console.log(req.body)
    const emailaddress= req.body.emailaddress;
    const role= req.body.role;

    try {
        let UserModel;
        switch(role){
            case "student":
                UserModel=StudentModel;
                break;
                case "parent":
                    UserModel=parentModel;
                    break;
                    case "teacher":
                    UserModel=TeacherModel;
                    break
                    default:
                        throw new ApiError(400,"role not recoginzed")
        }
    
        
       const finduser=await UserModel.findOne({emailaddress});
       if(!finduser){
          throw new ApiError(404,"user not found")
       }
      
       if(finduser.forgetPasswordOtp !== otp || finduser.forgetPasswordOtpExpiry < Date.now()){
          throw new ApiError(401,"invalid or expired Otp")
       }
       return res.status(200).json(new ApiResponse(200, "OTP verification successful"));
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
 })
 
exports.resetPassword=asyncHandler(async(req,res)=>{
    const {newpassword}=req.body;
    const emailaddress=req.body.emailaddress;
    const role= req.body.role;
    try {
        let UserModel;
        switch(role){
            case "student":
                UserModel=StudentModel;
                break;
                case "parent":
                    UserModel=parentModel;
                    break;
                    case "teacher":
                    UserModel=TeacherModel;
                    break
                    default:
                        throw new ApiError(400,"role not recoginzed")
        }
         const finduser=await UserModel.findOne({emailaddress});
         if(!finduser){
          throw new ApiError(404,"user not exist")
         }
         finduser.password=newpassword;
         finduser.forgetPasswordOtp=undefined;
         finduser.forgetPasswordOtpExpiry=undefined;
        await finduser.save();
        const emailsubject="password"
        const message="your password changed successfuly";
        const requestType="you have request to go to login page and login to your acccount"
         await sendEmail(emailsubject,finduser.emailaddress,message,requestType)
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("resfreshToken",options)
        .clearCookie("forgetpasswordemailrole",options)
        .json(
          new ApiResponse(200,{},"password changed succesfully")
        )
 
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
 })

 exports.addrecoveryemail=asyncHandler(async(req,res)=>{
    
 })
 