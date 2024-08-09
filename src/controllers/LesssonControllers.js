const subjectModel = require("../models/subject");
const topicModel = require("../models/topic");
const LessonsModel = require("../models/LessonsModel");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// const main = async () => {
//   let arr = await topicModel.find({});
  
//   arr.map(async (i) => {
//     let d = await LessonsModel.find({ topic: i._id }, { _id: 1, topic: 1 });
    
//     await topicModel.findOneAndUpdate({
//         _id:i._id
//     },
//     {
//         lessons:d.map((j)=>{return j._id})
//     })
//   });
// };
// main();
exports.AddLessons = asyncHandler(async (req, res) => {
  const topicId = req.params.id;
  const { lessonName, lessonContent } = req.body;
  if (!req.body || !req.body.lessonName || !req.body.lessonContent) {
    return res
      .status(200)
      .json({ message: "Missing required fields in the request body" });
  }

  try {
    const ExistTopic = await topicModel.findById({ _id: topicId });
    if (!ExistTopic) {
      return res.status(200).json({ message: "Topic not found" });
    }

    const lessonIds = ExistTopic.topicLessons;

    let lessonsData = [];
    for (const lessonId of lessonIds) {
      const lesson = await LessonsModel.findById(lessonId);
      if (lesson) {
        lessonsData.push(lesson);
      }
    }
    const lessonNames = lessonsData.map((lesson) =>
      lesson.lessonName.toLowerCase()
    );
    if (lessonNames.includes(lessonName.toLowerCase())) {
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

    res
      .status(200)
      .json(new ApiResponse(200, newLesson, "Lesson created successfully"));
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
