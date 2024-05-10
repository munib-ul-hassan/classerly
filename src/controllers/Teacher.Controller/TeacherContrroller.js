const subjectModel = require("../../models/CurriculumModel/subject");
const StudentModel = require("../../models/StudentModel/student");
const TeacherModel = require("../../models/TeacherModel/teachermodel");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");



exports.registerTeacher= asyncHandler(async(req,res)=>{
    try {
         const {fullname,username,emailaddress,password,fulladdress}=req.body;
         const existUser = await TeacherModel.findOne({ $or: [{ emailaddress }, { username: username.toLowerCase() }] });
         if (existUser) {
            return res.status(409).json({
                mesage:"teacher already exist with this username or email"
             })
         }
          const teacher=new TeacherModel({
                fullname,
                username,
                emailaddress,
                fulladdress,
                password,
          })
          await teacher.save();
          res.status(201).json(
           new ApiResponse(200,teacher,"teacher created succesfully")
          )
    } catch (error) {
        const errorMessage=error.Message || "something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500,errorMessage))
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
      console.error("Error:", error); // Log the error message
      const errorMessage = error.message || "Something went wrong";
      return res
        .status(error.status || 500)
        .json(new ApiResponse(error.status || 500, errorMessage));
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
            const students = await StudentModel.find({ studentSubjects: subject._id });

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




