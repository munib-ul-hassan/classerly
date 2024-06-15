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
    } = req.body;
    if (
      [fullName, userName, password, email, fullAddress, userType].some(
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
    let profile;
    if (userType == "Student") {
      if (parent) {
        const prt = await ParentModel.findOne({ code: parent });
        if (!prt) {
          throw Error("Invalid parent code");
          // return res.json({ success: false, message: "Parent Id is invalid" });
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
      profile = new TeacherModel({ auth: auth._id, grade });
      if (gradeData) {
        gradeData.teachers.push(profile._id);
        await gradeData.save();
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
    return res.json({
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
    return res.status(500).json({ success: false, message: e.message });
  }
});
exports.login = asyncHandler(async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      throw Error("userName and password are required");
    }
    const auth = await authModel.findOne({ userName }).populate("profile");
    if (auth && (await bcrypt.compare(password, auth.password))) {
      return res.json({
        success: true,
        data: {
          ...auth._doc,

          token: tokengenerate(auth),
        },
      });
    } else {
      throw Error("Invalid credentials");
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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
    
    return res.json({
      success: true,
      message: "Kindly check your email for password verification",
      token: tokengenerate(authdata),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
exports.verifyuser = asyncHandler(async (req, res) => {
  try {
    if (req.user.type != "forgotPassword") {
      throw Error("invalid token");
    }
    let auth = await authModel.findOne({
      _id: req.user.auth._id,
      otp: req.body.otp,
    });
    if (!auth) {
      throw Error("Invalid token or otp");
    }
    await authModel.findOneAndUpdate({ _id: req.user.auth._id }, { otp: null });
    let authdata = { ...auth._doc, type: "verify user" };

    return res.json({
      success: true,
      message: "User Verify successfully",
      token: tokengenerate(authdata),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
exports.resetpassword = asyncHandler(async (req, res) => {
  try {
    if (req.user.type != "verify user") {
      throw Error("invalid token");
    }
    let { password } = req.body;
    let auth = await authModel.findOne({ _id: req.user.auth._id });
    if (!auth) {
      throw Error("Invalid token");
    }
    await authModel.findOneAndUpdate(
      { _id: req.user._id },
      { password: await bcrypt.hash(password, 10) }
    );
    return res.json({
      success: true,
      message: "Password reset successfully",
      token: tokengenerate(auth),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
exports.updateuser = asyncHandler(async (req, res) => {
  try {
    const {} = req.body;
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
exports.getmyprofile = asyncHandler(async (req, res) => {
  try {
    let data;

    if (req.user.userType == "Student") {
      data = await authModel
        .findOne({ _id: req.user._id }, { password: 0 })
        .populate(["profile", "profile.parent", "profile.grade"]);
      // return res.json(data)
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
      // return res.json(data)
    }
    if (req.user.userType == "Parent") {
      data = await authModel
        .findOne({ _id: req.user._id }, { password: 0 })
        .populate(["profile", "profile.childIds"]);
    }

    return res.json({
      success: true,
      data: { ...data._doc, token: tokengenerate(data) },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
