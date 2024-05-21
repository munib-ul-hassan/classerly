const gradeModel = require("../../models/Grade/grade.models");
const { findById } = require("../../models/StudentModel/student");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");



exports.addGrade = asyncHandler(async (req, res) => {
    const { gradeNumber, gradeStudents, gradeTeachers, gradeSubjects } = req.body;
    try {

        const findSamegrade=await gradeModel.findOne({gradeNumber});
        if(findSamegrade){
            return res.status(500).json(
                {
                    message:"grade already exist"
                }
            )
        }
        const savegrade = new gradeModel({
            gradeNumber,
            gradeStudents,
            gradeSubjects,
            gradeTeachers
        });

        const uniqueSubjectIds = new Set();
        for (const subject of gradeSubjects) {
         
            if (subject && subject.subjectId) {
                uniqueSubjectIds.add(subject.subjectId);
            }
        }
        const uniqueSubjectArray = Array.from(uniqueSubjectIds);
        savegrade.gradeSubjects = uniqueSubjectArray.map(subjectId => ({ subjectId }));

        await savegrade.save();
        res.status(200).json({ savegrade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.getAllGrades=asyncHandler(async(req,res)=>{
    try {
        const allgrades=await gradeModel.find();
        res.status(200).json({
            message:"All grades",
             allgrades
        })
    } catch (error) {
        const errorMessage = error.message || "Something went wrong  in fetching grades";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
})

exports.getAllSubjectsOfGrade=asyncHandler(async(req,res)=>{
    const gradeId=req.params.id;
    try {
        const findgrade = await gradeModel.findById({ _id: gradeId }).populate("gradeSubjects");

        if(!findgrade){
            res.status(404).json(
                "grade not found"
            )
        }
        const subjects=findgrade.gradeSubjects;
        console.log(subjects);
        res.status(200).json(
            new ApiResponse(200,subjects,"found sucsessfully")
        )
    } catch (error) {
        const errorMessage=error.message || "somet thing went wrong";
       return res.status(error.status || 500).json(new ApiResponse(error.status || 500,errorMessage))
    }

})
