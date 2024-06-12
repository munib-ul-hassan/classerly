const subjectModel = require("../models/subject");
const topicModel = require("../models/topic");
const LessonsModel = require("../models/LessonsModel");


const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


exports.AddLessons = asyncHandler(async(req, res) => {
    const topicId = req.params.id;
    const { lessonName, lessonContent } = req.body;
    if (!req.body || !req.body.lessonName || !req.body.lessonContent) {
        return res.status(400).json({ message: "Missing required fields in the request body" });
    }
    
    
    try {
        const ExistTopic = await topicModel.findById({ _id: topicId });
        if (!ExistTopic) {
            return res.status(404).json({ message: "Topic not found" });
        }
  

        const lessonIds=ExistTopic.topicLessons;
       
        let lessonsData=[];
        for(const lessonId of lessonIds){
            const lesson=await LessonsModel.findById(lessonId)
            if(lesson){
                    lessonsData.push(lesson);
            }
        }
       const lessonNames=lessonsData.map(lesson=>lesson.lessonName.toLowerCase())
       if(lessonNames.includes(lessonName.toLowerCase())){
        throw new Error("Lesson with this name already exists in this Topic");
       }

         
      
      
       
        const newLesson = new LessonsModel({
            lessonName: lessonName.toLowerCase(),
            lessonContent,
            topicLessons: topicId,
        });

        
        await newLesson.save();

       
        ExistTopic.topicLessons.push(newLesson);

        
        await ExistTopic.save();

        res.status(201).json(
            new ApiResponse(200, newLesson, "Lesson created successfully")
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
