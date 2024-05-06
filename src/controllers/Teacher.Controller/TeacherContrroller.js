const TeacherModel = require("../../models/TeacherModel/teachermodel");
const asyncHandler = require("../../utils/asyncHandler");



exports.registerTeacher=asyncHandler(async(req,res)=>{
    const {fullname,username,emailaddress,password,gradeId}=req.body;
    try {
        const findteacher=await TeacherModel.findOne({emailaddress});
        if(findteacher){
            throw new Error("teacher alrsady exist")
        }
        const saveteacher=await new TeacherModel({
            fullname,
            username,
            emailaddress,
            password,
            grade
        }).save();
        res.status(200).json({
            saveteacher
        }) 
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})