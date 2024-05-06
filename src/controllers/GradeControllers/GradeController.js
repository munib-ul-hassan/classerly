const gradeModel = require("../../models/Grade/grade.models");
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