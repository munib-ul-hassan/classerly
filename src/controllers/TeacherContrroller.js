const subjectModel = require("../models/subject");
const StudentModel = require("../models/student");
const TeacherModel = require("../models/teacher");
const ApiResponse = require("../utils/ApiResponse");
// const ApiError = require("../utils/Apierror");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendemail");
const FeedbackModel = require("../models/feedback");
const teacherstudentrequestModel = require("../models/teacherstudentrequest");
const teacherModel = require("../models/teacher");
const topicModel = require("../models/topic");
const { default: mongoose } = require("mongoose");
const studentModel = require("../models/student");
const StudentquizesModel = require("../models/studentquizes");

exports.registerTeacher = asyncHandler(async (req, res) => {
  try {
    const { fullname, username, emailaddress, password, fulladdress } =
      req.body;
    const existUser = await TeacherModel.findOne({
      $or: [{ emailaddress }, { username }],
    });
    if (existUser) {
      throw new Error("User already exists");
    }
    const teacher = new TeacherModel({
      fullname,
      username: username.toLowerCase(),
      emailaddress,
      fulladdress,
      password,
    });
    await teacher.save();
    const emailsubject = "Teacher Registration";
    const email = emailaddress;
    const message = `You are registered successfully as Teacher`;
    const requestType = "Your request for Teacher registration is done";
    await sendEmail(emailsubject, email, message, requestType);
    res
      .status(201)
      .json(new ApiResponse(200, teacher, "teacher created succesfully"));
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, errorMessage));
  }
});

exports.teacherAddsubjects = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;
  const subjectId = req.params.id;
  try {
    const findSubject = await subjectModel.findOne({ _id: subjectId });
    if (!findSubject) {
      throw new Error("Subject not found");
    }

    if (findSubject.subjectTeacher) {
      throw new Error("Subject already has a taken by teacher");
    }

    const existTeacher = await TeacherModel.findOne({ _id: teacherId });
    if (!existTeacher) {
      throw new Error("Teacher not found");
    }

    existTeacher.teachersSubjects.push(subjectId);
    findSubject.subjectTeacher = teacherId;

    await existTeacher.save();
    await findSubject.save();

    res
      .status(201)
      .json(new ApiResponse(200, findSubject, "Subject added successfully"));
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, errorMessage));
  }
});

exports.allSubjectsOfteacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;

  try {
    const findTeacher = await TeacherModel.findById(teacherId).populate(
      "teachersSubjects"
    );
    const teacherSubjects = findTeacher.teachersSubjects;

    // Initialize an empty array to store subjects and students
    const subjectsWithStudents = [];

    // Iterate over each subject taught by the teacher
    for (const subject of teacherSubjects) {
      // Find students studying the current subject
      const students = await StudentModel.find({
        studentSubjects: subject._id,
      }).select("-password");

      // Push subject and corresponding students to the array
      subjectsWithStudents.push({
        subject: subject,
        students: students,
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: subjectsWithStudents,
      message: "Subjects and students of teacher found successfully",
      success: true,
    });
  } catch (error) {
    res.status(200).json({ message: error.message, success: false });
  }
});

exports.feedBacktoTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  const { feedbackFrom, feedbackText, feedbackBy } = req.body;

  try {
    const newFeedback = {
      feedbackFrom: feedbackFrom,
      feedbackText: feedbackText,
      feedbackBy: feedbackBy,
    };
    const teacher = await TeacherModel.findById({ _id: teacherId });

    if (!teacher) {
      return res.status(200).json({ message: "Teacher not found" });
    }
    teacher.feedback.push(newFeedback);
    await teacher.save();

    res.status(200).json({ message: "Feedback added successfully" });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

exports.myFeedBacks = asyncHandler(async (req, res) => {
  try {
    const findTeacher = await FeedbackModel.find({
      to: req.user.profile._id,
    }).populate({
      path: "from",
      populate: {
        path: "auth",
        select: "-password", // Exclude the 'password' field
      },
    });

    res
      .status(201)
      .json(new ApiResponse(200, findTeacher, "feedbacks Found Successfully"));
  } catch (error) {
    res.status(200).json({ message: error.message || "Something went wrong" });
  }
});

exports.mystudents = async (req, res) => {
  try {
   
    let data = await teacherModel
      .findOne(
        {
          _id: req.user?.profile?._id,
        },
        { students: 1 }
      )
      .populate({
        path: "students",
        select: "auth",
        populate: {
          path: "auth",
         
          select: ["userName", "fullName", "email", "image", "fullAddress"],
        },
      })
      .populate({
        path: "students",
        select: ["auth","code"],

        populate: [{
          path: "grade",
          select: ["grade"]
          
        },
        
        { path: "subjects", select: ["image", "name"] },
        
        ],
      });
      if (data?.students?.length > 0) {
      let val = [];
      data?.students.map(async (i, index) => {
        
        let q = await StudentquizesModel.find({ student: i?._id });
        
        val.push({ ...i._doc, quiz:{
          total: q.length,
          pass: q.filter((i) => {
            return i.result == "pass";
          }).length
        } });

        if (index == data?.students.length - 1) {
          setTimeout(()=>{
          return res
            .status(200)
            .json({
              success: true,
              data: val,
              message: "get Student successfully",
            });},100)
        }
      });
    } else {
      return res
        .status(200)
        .jsoon({ success: true, data: [], message: "You have no any student" });
    }
  } catch (error) {
    res.status(200).json({ message: error.message || "Something went wrong" });
  }
};

exports.addstudent = async (req, res) => {
  try {
    const { stdId } = req.body;
    if (!stdId) {
      return res
        .status(200)
        .json({ success: false, message: "StdId is required" });
    }
    stdId.map(async (i, index) => {
      let std = await StudentModel.findOne({ code: i });
      if (!std) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid Student Id" });
      } else {
        let alreadyregisted = await teacherstudentrequestModel.findOne({
          teacher: req.user.profile._id,
          student: std._id,
        });
        if (alreadyregisted) {
          if (
            alreadyregisted.status == "Pwnding" ||
            alreadyregisted.status == "Rejected"
          ) {
            return res
              .status(200)
              .json({
                success: false,
                message: "Already applied for addition",
              });
          } else {
            return res
              .status(200)
              .json({ success: false, message: "Already a student" });
          }
        }
        let str = await new teacherstudentrequestModel({
          teacher: req.user.profile._id,
          student: std._id,
        }).save();
      }
      if (index == stdId.length - 1) {
        return res
          .status(200)
          .json({ success: true, message: "Request added successfully" });
      }
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
exports.mydashboard = async (req, res) => {
  try {
    let data = await teacherModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?.profile?._id),
        },
      },
      {
        $lookup: {
          from: "quizes",
          let: { teacherId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$createdBy" }, "$$teacherId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "quizes",
        },
      },
      {
        $lookup: {
          from: "games",
          let: { teacherId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$createdBy" }, "$$teacherId"], // Convert topic field to string and compare
                },
              },
            },
          ],
          as: "games",
        },
      },
    ]);
    // let data = await teacherModel.findOne({
    //   _id: req.user?.profile?._id

    // })

    res.status(200).json({
      success: true,
      message: "Data get successfully",
      data: {
        students: data[0]?.students?.length,
        subject: data[0]?.subjects?.length,
        quizes: data[0]?.quizes?.length,
        games: data[0]?.games?.length,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
exports.mycourses = async (req, res) => {
  try {
    const mycourses = await subjectModel.find({
      _id: { $in: req.user?.profile?.subjects },
    });
    const newcourses = await subjectModel
      .find({
        _id: { $nin: req.user?.profile?.subjects },
        grade: req.user?.profile?.grade?._id,
      })
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Data get successfully",
      data: {
        mycourses,
        newcourses,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.addfeedback = asyncHandler(async (req, res) => {
  try {
    const { student, feedback, star, grade } = req.body;
    const existStudent = await studentModel.findOne({ _id: student });
    // const existfeedback = await FeedbackModel.findOne({
    //   student,
    //   teacher: req.user.profile._id,
    //   grade,
    // });

    if (!existStudent) {
      throw new Error("Invalid student id");
    }
    // if (existfeedback) {
    //   throw new Error("already added feedback");
    // }
    if (star > 5) {
      throw new Error("value of star must be equal to or less than 5");
    }
    // if(!existStudent.teacher.includes(req.user.profile._id)){
    //   throw new Error("You can't add feedback for this teacher");

    // }
    const feedbackdata = await FeedbackModel.findOneAndUpdate(
      {
        fromType: "Teacher",
        to: student,
        toType: "Student",
        from: req.user.profile._id,
      },
      {
        $set: {
          fromType: "Teacher",
          to: student,
          toType: "Student",
          from: req.user.profile._id,
          grade,
          feedback,
          star: parseInt(star),
        },
      },
      { upsert: true, new: true }
    );
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
});
exports.mysubjects = async (req, res) => {
  try {
    let data = await teacherModel
      .findOne({ _id: req.user?.profile?._id })
      .populate({ path: "subjects", select: ["name", "image"] });
    return res.send({
      success: true,
      data: data.subjects,
      message: "subjects get Successfully",
    });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};