const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
const TeacherModel = require("../models/teacher");
const authModel = require("../models/auth");
const asyncHandler = require("../utils/asyncHandler");
const { generateSixDigitCode } = require("../utils/generateotp");
const sendEmail = require("../utils/sendemail");
const { tokengenerate } = require("../middlewares/auth");

exports.register = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      userName,
      password,
      email,
      fullAddress,
      userType,
      grade,
      parent,
      stdId,
    } = req.body;
    if (
      [fullName, userName, password, email, fullAddress, userType].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, "Invalid email address");
    }
    let auth;
    try{
    auth = new authModel({
      fullName,
      userName,
      password,
      email,
      fullAddress,
      userType,
    });}catch(e){
      console.log("=================",e)
    }
    let profile;
    if (userType == "Student") {
      if (parent) {
        const prt = await ParentModel.findOne({ prtId: parent });
        if (!prt) {
            return res.json({ success: false, message: "Parent Id is invalid" });
          }
          profile = new StudentModel({
            auth: auth._id,
            stdId: generateSixDigitCode(),
            parent,
          });
      }else{
      profile = new StudentModel({
        auth: auth._id,
        stdId: generateSixDigitCode(),
        
      });}
      const emailsubject = "Student Registration";
      
      const message = `You are registered successfully. Your student ID is ${profile.stdId}.`;
      const requestType = "Your request for student registration is done";
      console.log(message)
      await sendEmail(emailsubject, email, message, requestType);
    }
    if (userType == "Teacher") {
      profile = new TeacherModel({ auth: auth._id, grade });
    }
    if (userType == "Parent") {
      if (childIds) {
        const std = await StudentModel.findOne({ $in: childIds });
        if (!std) {
          return res.json({ success: false, message: "Student Id is invalid" });
        }
      }
      profile = new ParentModel({
        auth: auth._id,
        grade,
        childIds,
        prtId: generateSixDigitCode(),
      });
    }
    auth.profile = profile._id
    
 await    auth.save()
    // .then().catch((e)=>{
    //   if(e.code==11000){

    //   }
    // })
    await profile.save()
    return res.json({success:true,data:{...auth._doc,...profile._doc},token:tokengenerate(auth)})

  } catch (e) {
    console.log("==========1")
    if(e.code==11000){
      return res.status(500).json({success:false, message: "No duplicate username acceptable" });

  }
  return res.status(500).json({success:false, message: e.message });

  }
});
exports.login = asyncHandler(async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
});
exports.forgotpassword = asyncHandler(async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
});
exports.verifyuser = asyncHandler(async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
});
exports.resetpassword = asyncHandler(async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
});
exports.updateuser = asyncHandler(async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: error.message });
  }
});
