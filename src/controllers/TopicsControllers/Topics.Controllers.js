const subjectModel = require("../../models/CurriculumModel/subject");
const topicModel = require("../../models/CurriculumModel/topic");
const gradeModel = require("../../models/Grade/grade.models");
const LessonsModel = require("../../models/LessonsModel/LessonsModel");
const { find, findById } = require("../../models/StudentModel/student");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");



exports.AddTopics = asyncHandler(async (req, res) => {
    const { topicname, lessonHours, practiceHours, difficulty, quizzes, status } = req.body;
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
            subjectId,
            lessonHours,
            quizzes,
            status,
            practiceHours,
            difficulty,
            subjectName:findSubject.subjectname
        }).save();

        findSubject.subjectTopics.push(newTopic._id);
        await findSubject.save();

        res.status(200).json({ Topics: newTopic });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

exports.getAllLessonsOfTopics = asyncHandler(async (req, res) => {
    const topicId = req.params.id;
    try {
        const findTopicLesson = await topicModel.findById({ _id: topicId }).populate("topicLessons");
        if (!findTopicLesson) {
            throw new Error("Topic not found")
        }
        const Lessons = findTopicLesson.topicLessons;
        res.status(200).json(
            new ApiResponse(200, Lessons, "lesson found sucessfully")
        )
    } catch (error) {
        res.status(500).json({ mesage: "error.message" || "somthing went wrong" })
    }
})
exports.deleteTopics = asyncHandler(async (req, res) => {
    const topicId = req.params.id;

    try {
        const findtopic = await topicModel.findById(topicId);
        if (!findtopic) {
            throw new Error("Topic not exist with this name");
        }

        const findsubject = await subjectModel.findById(findtopic.subjectId);
        console.log(findsubject);

    } catch (error) {
        const errorMessage = error.message || "something went wrong"
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage))
    }
})

exports.getcontentOfLesson = asyncHandler(async (req, res) => {
    const LessonId = req.params.id;
    console.log('LessonId:', LessonId);


    try {
       
        const findLesson = await LessonsModel.findById({_id:LessonId});
        console.log('findLesson:', findLesson);

        if (!findLesson) {
            return res.status(404).json(new ApiResponse(404, 'Lesson not found'));
        }

        res.status(200).json({
            message: 'Content Found',
            data: findLesson.lessonContent
        });
    } catch (error) {
        const errorMessage = error.message || 'Something went wrong';
        return res.status(500).json(new ApiResponse(500, errorMessage));
    }
});