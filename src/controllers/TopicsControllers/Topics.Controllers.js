const subjectModel = require("../../models/CurriculumModel/subject");
const topicModel = require("../../models/CurriculumModel/topic");
const { find, findById } = require("../../models/StudentModel/student");
const asyncHandler = require("../../utils/asyncHandler");



exports.AddTopics=asyncHandler(async(req,res)=>{
    const {topicname,lessons}=req.body;
    const subjectId=req.params.id;
    try {
         
      
        const findSubject=await subjectModel.findById(subjectId).populate('subjectTopics');
        if(!findSubject){
            throw new Error("subject not found");
        }
        const topicIds= findSubject.subjectTopics;
        const topicData = [];
        for(const topicId of topicIds){
          
            const topic=await topicModel.findById(topicId);
            if (topic) {
                topicData.push(topic);
            }
           
        }
        const topicNames = topicData.map(topic => topic.topicname);
await Promise.all(topicNames.map(async (item) => {
    if (item === topicname) {
        throw new Error("Topic with this name already exists in this subject");
    }
}));
        
        const Topics=await new topicModel({
            topicname,
            lessons
        }).save();

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