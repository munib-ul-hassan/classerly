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

exports.teacherAddsubjects=asyncHandler(async(req,res)=>{
    const teacherId=req.body;
    const subjectId=req.params.id;
    try {
         const findsubject=await subjectModel.findOne({_id:subjectId});
         if(!findsubject){
            throw new Error("subject not found")
         }
         findsubject.teacherId=subjectTeacher;
         res.status(201).json(
            new ApiResponse(200,{},"subject added Successfully")
         )

    } catch (error) {
        const errorMessage=error.Message || "something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500,errorMessage))
    }
})
