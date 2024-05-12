const subjectModel = require("../../models/CurriculumModel/subject");
const gradeModel = require("../../models/Grade/grade.models");
const { findOne } = require("../../models/StudentModel/student");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/Apierror");
const asyncHandler = require("../../utils/asyncHandler");

exports.AddSubject = asyncHandler(async(req, res) => {
    const { subjectname } = req.body;
    const gradeId = req.params.id;
    try {
        const grade = await gradeModel.findById(gradeId).populate('gradeSubjects');

        if (!grade) {
            throw new Error("Grade not found");
        }

        const subjectIds = grade.gradeSubjects.map(subject => subject._id);
        const subjectData = [];
        for (const subjectId of subjectIds) {
            const subject = await subjectModel.findById(subjectId);
            if (subject) {
                subjectData.push(subject);
            }
        }

        const subjectNames = subjectData.map(subject => subject.subjectname.toLowerCase());
        if (subjectNames.includes(subjectname.toLowerCase())) {
            throw new Error("Subject with this name already exists in this grade");
        }

        const newSubject = await new subjectModel({ subjectname: subjectname.toLowerCase(), gradeId }).save();
        grade.gradeSubjects.push(newSubject);
        await grade.save();
        res.status(200).json({
            message: "Subject created",
            Subjectsave: newSubject
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


exports.getAlltopicsofsubject=asyncHandler(async(req,res)=>{
    const subjectId=req.params.id;
    try {
         const topicsOfSubject=await subjectModel.findById({_id:subjectId}).populate("subjectTopics");
          if(!topicsOfSubject){
            throw new Error("Subject not found");
          }
          const subjectTopics=topicsOfSubject.subjectTopics;
         res.status(201).json(
            new ApiResponse(200,subjectTopics,"Topics Found Succesfuly")
         )
    } catch (error) {
         res.status(500).json({message:error.message})
    }
})

exports.deleteSubject=asyncHandler(async(req,res)=>{
    const subjectId=req.params.id;
    console.log(subjectId);
    try {
          const findsubject=await subjectModel.findById({_id:subjectId});
          if(!findsubject){
            throw new Error("subject not found");
          }
          const findgrade=await gradeModel.findById(findsubject.gradeId);
          if (!findgrade) {
            throw new Error(500, 'Grade not found');
        }
        //  const findSubjectInteracher=await 
        findgrade.gradeSubjects= findgrade.gradeSubjects.filter(subject=> subject._id.toString() ==! subjectId);
         await findgrade.save();

         await findsubject.deleteOne();
         res.status(200).json(
            new ApiResponse(
                .200,
                findsubject,
                "subject deleted successfuly"
            )
         )
    } catch (error) {
        const errorMessage=error.message || "something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500,errorMessage))
        
    }
})