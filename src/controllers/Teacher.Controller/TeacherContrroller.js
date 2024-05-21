const subjectModel = require("../../models/CurriculumModel/subject");
const StudentModel = require("../../models/StudentModel/student");
const TeacherModel = require("../../models/TeacherModel/teachermodel");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/Apierror");
const asyncHandler = require("../../utils/asyncHandler");
const sendEmail = require("../../utils/sendemail");



exports.registerTeacher= asyncHandler(async(req,res)=>{
  console.log(req.body);
    try {
         const {fullname,username,emailaddress,password,fulladdress}=req.body;
         const existUser = await TeacherModel.findOne({ $or: [{ emailaddress }, { username }] });
         if (existUser) {
          throw new ApiError(409, 'User already exists');
      }
          const teacher=new TeacherModel({
                fullname,
                username:username.toLowerCase(),
                emailaddress,
                fulladdress,
                password,
          })
          await teacher.save();
          const emailsubject = "Teacher Registration";
          const email = emailaddress;
          const message = `You are registered successfully as Teacher`;
          const requestType = "Your request for Teacher registration is done";
          await sendEmail(emailsubject, email, message, requestType);
          res.status(201).json(
           new ApiResponse(200,teacher,"teacher created succesfully")
          )
    } catch (error) {
      const errorMessage = error.message || "Something went wrong";
      res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
})

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
  
      res.status(201).json(
        new ApiResponse(200, findSubject, "Subject added successfully")
      );
    } catch (error) {
      const errorMessage = error.message || "Something went wrong";
      return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
  });
  

  exports.allSubjectsOfteacher = asyncHandler(async (req, res) => {
    const teacherId = req.params.id;
    try {
        const findTeacher = await TeacherModel.findById(teacherId).populate("teachersSubjects");
        const teacherSubjects = findTeacher.teachersSubjects;

        // Initialize an empty array to store subjects and students
        const subjectsWithStudents = [];

        // Iterate over each subject taught by the teacher
        for (const subject of teacherSubjects) {
            // Find students studying the current subject
            const students = await StudentModel.find({ studentSubjects: subject._id }).select("-password");

            // Push subject and corresponding students to the array
            subjectsWithStudents.push({
                subject: subject,
                students: students
            });
        }

        res.status(200).json({
            statusCode: 200,
            data: subjectsWithStudents,
            message: "Subjects and students of teacher found successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});




exports.feedBacktoTeacher = asyncHandler(async (req, res) => {
       const teacherId=req.params.id;
    const { feedbackFrom, feedbackText,feedbackBy} = req.body; 
    console.log(feedbackFrom);
    try {
        const newFeedback = {
            feedbackFrom: feedbackFrom,
            feedbackText: feedbackText,
            feedbackBy: feedbackBy
        };
        const teacher = await TeacherModel.findById({_id:teacherId});
        console.log(teacher);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        teacher.feedback.push(newFeedback);
        await teacher.save();

        res.status(201).json({ message: "Feedback added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



exports.myFeedBacks = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  try {
    const findTeacher = await TeacherModel.findById({ _id: teacherId })
      .populate({
        path: "feedback.feedbackBy",
        select: "-password -stdid" // Exclude the 'password' field
      })
      .select("-password -stdid"); // Exclude the 'password' field from the main document as well

    console.log("findTeacher:", findTeacher);
    res.status(201).json(
      new ApiResponse(200, findTeacher, "Teacher Found Successfully")
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});


