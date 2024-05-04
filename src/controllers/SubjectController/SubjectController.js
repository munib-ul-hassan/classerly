const subjectModel = require("../../models/CurriculumModel/subject");
const asyncHandler = require("../../utils/asyncHandler");


exports.AddSubject=asyncHandler(async(req,res)=>{
    const {subjectname}=req.body;
    const gradeId=req.params.id;
    try {
        const Subjectsave=await new subjectModel({
            subjectname,
            gradeId
        }).save()
        res.status(200).json({
            message:"subject created",
            Subjectsave
        })
    } catch (error) {
        res.status.json({
            message:error.message
        })
    }
})