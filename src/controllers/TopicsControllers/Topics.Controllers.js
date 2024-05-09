const subjectModel = require("../../models/CurriculumModel/subject");
const topicModel = require("../../models/CurriculumModel/topic");
const gradeModel = require("../../models/Grade/grade.models");
const { find, findById } = require("../../models/StudentModel/student");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");



exports.AddTopics = asyncHandler(async(req, res) => {
    const { topicname} = req.body;
    const subjectId = req.params.id;
    try {
        const findSubject = await subjectModel.findById(subjectId).populate('subjectTopics');
        if (!findSubject) {
            throw new Error("Subject not found");
        }
        
        const topicIds = findSubject.subjectTopics;
        const topicData = [];
        for (const topicId of topicIds) {
            const topic = await topicModel.findById(topicId);
            if (topic) {
                topicData.push(topic);
            }
        }

        const topicNames = topicData.map(topic => topic.topicname.toLowerCase());
        if (topicNames.includes(topicname.toLowerCase())) {
            throw new Error("Topic with this name already exists in this subject");
        }
        
        const newTopic = await new topicModel({
            topicname: topicname.toLowerCase(), 
            subjectId
        }).save();

        findSubject.subjectTopics.push(newTopic._id);
        await findSubject.save();

        res.status(200).json({ Topics: newTopic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

exports.deleteTopics=asyncHandler(async(req,res)=>{
    const topicId=req.params.id;

    try {
         const findtopic=await topicModel.findById(topicId);
         if(!findtopic){
              throw new Error("Topic not exist with this name");
         }

         const findsubject=await subjectModel.findById(findtopic.subjectId);
         console.log(findsubject);

    } catch (error) {
        const errorMessage=error.message || "something went wrong"
       return res.status(error.status || 500).json(new ApiResponse(error.status || 500,errorMessage))
    }
})