const subjectModel = require("../../models/CurriculumModel/subject");
const topicModel = require("../../models/CurriculumModel/topic");
const { find } = require("../../models/StudentModel/student");
const asyncHandler = require("../../utils/asyncHandler");



exports.AddTopics=asyncHandler(async(req,res)=>{
    const {topicname,lessons}=req.body;
    const subjectId=req.params.id;
    try {
         
        const Topics=await new topicModel({
            topicname,
            lessons
        }).save();


        const findSubject=await subjectModel.findOne({_id:subjectId});
        if(!findSubject){
            throw new Error("subject not found");
        }
        findSubject.subjectTopics.push(Topics._id);
        await findSubject.save();
        

        res.status(200).json(
            {
                Topics
            }
        )
        
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }

})