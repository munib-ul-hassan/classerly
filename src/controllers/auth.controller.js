const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
const TeacherModel = require("../models/teacher");
const authModel = require("../models/auth");
const asyncHandler = require("../utils/asyncHandler");
const { generateSixDigitCode, generateOTP } = require("../utils/generateotp");
const sendEmail = require("../utils/sendemail");
const { tokengenerate } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const adminModel = require("../models/admin");
const gradeModel = require("../models/grade.models");
const studentModel = require("../models/student");
const parentModel = require("../models/parent");
const teacherModel = require("../models/teacher");
const subjectModel = require("../models/subject");

exports.register = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const {
      fullName,
      userName,
      password,
      email,
      fullAddress,
      userType,
      grade,
      parent,
      childIds,
      subject
    } = req.body;
    if (
      [fullName, userName, password, email, userType].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      throw Error("All fields are required");
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw Error("Invalid email address");
    }

    let auth = new authModel({
      fullName,
      userName,
      password,
      email,
      fullAddress,
      userType,
    });
    let gradeData;
    if (grade) {
      gradeData = await gradeModel.findOne({ _id: grade });
      if (!gradeData) {
        throw Error("Invalid grade selected");
      }
    }
    let subjectData;
    if (subject) {
      subjectData = await subjectModel.findOne({ _id:subject });
      if (!subjectData) {
        throw Error("Invalid subject selected");
      }
    }
    let profile;
    if (userType == "Student") {
      if (parent) {
        const prt = await ParentModel.findOne({ code: parent });
        if (!prt) {
          throw Error("Invalid parent code");
          // return res.status(200).json({ success: false, message: "Parent Id is invalid" });
        }
        profile = new StudentModel({
          auth: auth._id,
          code: generateSixDigitCode(),
          parent: prt._id,
          grade,
        });
        prt.childIds.push(profile._id);
        await prt.save();
        if (gradeData) {
          gradeData.students.push(profile._id);
          await gradeData.save();
        }
      } else {
        profile = new StudentModel({
          auth: auth._id,
          code: generateSixDigitCode(),
          grade,
        });
        if (gradeData) {
          gradeData.students.push(profile._id);
          await gradeData.save();
        }
      }
      const emailsubject = "Student Registration";

      const message = `You are registered successfully. Your student ID is ${profile.code}.`;
      const requestType = "Your request for student registration is done";

      await sendEmail(emailsubject, email, message, requestType);
    } else if (userType == "Teacher") {
      profile = new TeacherModel({ auth: auth._id, grade,subject });
      if (gradeData) {
        gradeData.teachers.push(profile._id);
        await gradeData.save();
      }
      if (subjectData) {
        subjectData.teachers.push(profile._id);
        await subjectData.save();
      }
    } else if (userType == "Parent") {
      if (childIds) {
        const std =
          (await StudentModel.find({ code: { $in: childIds } }, { _id: 1 })) ??
          [];

        if (std.length != childIds.length) {
          throw Error("Some or all of Student Ids are invalid");
        }
        profile = new ParentModel({
          auth: auth._id,

          childIds: std.map((i) => {
            return i._id;
          }),
          code: generateSixDigitCode(),
        });
        await StudentModel.updateMany(
          { code: { $in: childIds } },
          { parent: profile._id }
        );
      } else {
        profile = new ParentModel({
          auth: auth._id,

          code: generateSixDigitCode(),
        });
      }
    } else if (userType == "Admin") {
      const admins = await adminModel.find({});
      if (admins.length > 0) {
        throw Error("Admin already registered");
      }
      profile = new adminModel({
        auth: auth._id,
        code: generateSixDigitCode(),
      });
    } else {
      throw Error("UserType must be Student, Teacher or Parent");
    }
    auth.profile = profile._id;

    await auth.save();

    await profile.save();
    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      data: {
        ...auth._doc,
        ...profile._doc,

        token: tokengenerate(auth),
      },
    });
  } catch (e) {
    await session.abortTransaction();

    if (e.code == 11000) {
      return res
        .status(500)
        .json({ success: false, message: "No duplicate username acceptable" });
    }
    return res.status(200).json({ success: false, message: e.message });
  }
});
exports.login = asyncHandler(async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      throw Error("userName and password are required");
    }
    // const result = await authModel.aggregate([
    //   // Match the document with the given userName
    //   { $match: { userName: userName } },

    //   {
    //     $addFields: {
    //       profileTable: {
    //         $switch: {
    //           branches: [
    //             { case: { $eq: ["$userType", "Student"] }, then: "students" },
    //             { case: { $eq: ["$userType", "Parent"] }, then: "parents" },
    //             { case: { $eq: ["$userType", "Teacher"] }, then: "teachers" }
    //           ],
    //           default: null
    //         }
    //       }
    //     }
    //   },

    //   // Lookup to join with the appropriate profile collection based on userType
    //   {
    //     $lookup: {
    //       from: "$profileTable" ,
    //       localField: "profile",
    //       foreignField: "_id",
    //       as: "profile"
    //     }
    //   },

    //   // Unwind the profile array (since profile should be a single object, not an array)
    //   { $unwind: "$profile" },

    //   // Conditionally join the grade collection if userType is student
    //   {
    //     $lookup: {
    //       from: "grades",
    //       localField: "profile.grade",
    //       foreignField: "_id",
    //       as: "profile.grade",
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: ["$userType", "Student"]
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   },

    //   // Unwind the grade array (since grade should be a single object, not an array)
    //   { $unwind: { path: "$profile.grade", preserveNullAndEmptyArrays: true } }
    // ]);

    // Assuming you're using async/await

    const auth = await authModel.findOne({ userName }).populate({
      path: "profile",
      populate: {
        path: "grade",
      },
    });
    if (auth && (await bcrypt.compare(password, auth.password))) {
      auth._doc.profile.grade = {
        grade: auth._doc?.profile?.grade?.grade,
        _id: auth._doc?.profile?.grade?._id,
      };
      return res.status(200).json({
        success: true,
        message: "loggedin successfully",
        data: {
          ...auth._doc,

          token: tokengenerate(auth),
        },
      });
    } else {
      throw Error("Invalid credentials");
    }
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
exports.forgotpassword = asyncHandler(async (req, res) => {
  try {
    const { userName } = req.body;
    const auth = await authModel.findOne({
      $or: [{ userName }, { email: userName }],
    });
    if (!auth) {
      throw Error("Invalid email or username");
    }
    let otp = generateOTP();
    const emailsubject = "Email for User Verification";

    const message = `Hi ${auth.userName} We received a request to reset your password for your account. Your authentication code is ${otp}.`;
    const requestType = "Your request for forgot password is done";

    await sendEmail(emailsubject, auth.email, message, requestType);
    await authModel.findOneAndUpdate({ _id: auth._id }, { otp });

    let authdata = { ...auth._doc, type: "forgotPassword" };

    return res.status(200).json({
      success: true,
      message: "Kindly check your email for password verification",
      token: tokengenerate(authdata),
    });
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
exports.verifyuser = asyncHandler(async (req, res) => {
  try {
    if (req.user.type != "forgotPassword") {
      throw Error("invalid token");
    }
    let auth = await authModel.findOne({
      _id: req.user._id,
      otp: req.body.otp,
    });
    if (!auth) {
      throw Error("Invalid token or otp");
    }
    await authModel.findOneAndUpdate({ _id: req.user._id }, { otp: null });
    let authdata = { ...auth._doc, type: "verify user" };

    return res.status(200).json({
      success: true,
      message: "User Verify successfully",
      token: tokengenerate(authdata),
    });
  } catch (e) {
    
    res.status(200).json({ success: false, message: e.message });
  }
});
exports.resetpassword = asyncHandler(async (req, res) => {
  try {
    if (req.user.type != "verify user") {
      throw Error("invalid token");
    }
    let { password } = req.body;
    let auth = await authModel.findOne({ _id: req.user._id });
    if (!auth) {
      throw Error("Invalid token");
    }
    await authModel.findOneAndUpdate(
      { _id: req.user._id },
      { password: await bcrypt.hash(password, 10) }
    );
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      token: tokengenerate(auth),
    });
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
exports.updateuser = asyncHandler(async (req, res) => {
  try {
    const { userName, image, password, grade ,subject } = req.body;
    const cleanObject = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([key, value]) =>
            value !== null &&
            value !== "null" &&
            value !== "" &&
            value !== undefined &&
            value !== "undefined"
        )
      );
    };
    if (userName || image) {
      await authModel.findByIdAndUpdate(
        { _id: req.user._id },
        cleanObject({
          userName,
          image,
        })
      );
    }
    
    if (grade) {
      
      switch (req.user.userType) {
        case "Student": {
          await studentModel.findOneAndUpdate(
            {
              auth: req.user._id,
            },
            {
              grade,
            },
            { new: true }
          );
        }
        case "Parent": {
          await parentModel.findOneAndUpdate(
            {
              auth: req.user._id,
            },
            {
              grade,
            },
            { new: true }
          );
        }
        case "Teacher": {
          await teacherModel.findOneAndUpdate(
            {
              auth: req.user._id,
            },
            {
              grade,
            },
            { new: true }
          );
        }
        default: {
        }
      }
      // let d =[
      //         req.user.userType == "Student"
      //           ? studentModel
      //           : req.user.userType == "Parent"
      //           ? parentModel
      //           : teacherModel
      //       ].findOneAndUpdate(
      //         {
      //           auth: req.user._id,
      //         },
      //         {
      //           grade
      //         },{new:true}
      //       );
      
    }
    let data = await authModel.findOne({ _id: req.user._id }).populate({
      path: "profile",
      populate: {
        path: "grade",
      },
    });
    return res.status(200).json({
      success: true,
      data: {
        data,

        token: tokengenerate(data),
      },
    });
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
exports.getmyprofile = asyncHandler(async (req, res) => {
  try {
    let data;

    if (req.user.userType == "Student") {
      data = await authModel
        .findOne({ _id: req.user._id }, { password: 0 })
        .populate(["profile", "profile.parent", "profile.grade"]);
      // return res.status(200).json(data)
    }
    if (req.user.userType == "Teacher") {
      data = await authModel
        .findOne({ _id: req.user._id }, { password: 0 })
        .populate([
          "profile",
          "profile.grade",
          "profile.subjects",
          "profile.feedback",
        ]);
      // return res.status(200).json(data)
    }
    if (req.user.userType == "Parent") {
      data = await authModel
        .findOne({ _id: req.user._id }, { password: 0 })
        .populate(["profile", "profile.childIds"]);
    }

    return res.status(200).json({
      success: true,
      data: { ...data._doc, token: tokengenerate(data) },
    });
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});

exports.changepassword = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
   

    if (password != confirmPassword) {
      return res
        .status(200)
        .json({
          success: false,
          message: "password and confirm password must be same",
        });
    } else if (!(await bcrypt.compare(oldPassword,req.user.password))) {
      return res
        .status(200)
        .json({ success: false, message: "incorrect old password" });
    } else {
      let auth = await authModel.findOneAndUpdate(
        { _id: req.user._id },
        { password: await bcrypt.hash(password, 10) },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
        token: tokengenerate(auth),
      });
    }
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
};
