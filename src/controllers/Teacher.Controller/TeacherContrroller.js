const subjectModel = require("../../models/CurriculumModel/subject");
const TeacherModel = require("../../models/TeacherModel/teachermodel");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");



exports.registerTeacher= asyncHandler(async(req,res)=>{
    try {
         const {fullname,username,emailaddress,password,fulladdress}=req.body;
         const existUser = await TeacherModel.findOne({ $or: [{ emailaddress }, { username: username.toLowerCase() }] });
         if (existUser) {
             res.status(409).json({
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
        throw new Error("Subject already has a teacher assigned");
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
  