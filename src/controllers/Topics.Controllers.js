const topicModel = require("../models/topic");
const gradeModel = require("../models/grade.models");
const LessonsModel = require("../models/LessonsModel");
const { find, findById } = require("../models/student");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const subjectModel = require("../models/subject");

exports.AddTopic = asyncHandler(async (req, res) => {
  const { name, image, subject, difficulty, type } = req.body;

  try {
    const findSubject = await subjectModel.findById(subject).populate("topics");
    if (!findSubject) {
      throw new Error("Subject not found");
    }
    const findTopic = await topicModel.findOne({
      name: name.toLowerCase(),
      subject,
    });
    if (findTopic) {
      throw new Error("Topic with this name already exists in this subject");
    }
    if (!["Beginner", "Medium", "Advanced"].includes(difficulty)) {
      throw new Error(
        "difficulty is not valid. it only be Beginner,Medium or Advanced "
      );
    }
    const newTopic = await new topicModel({
      name: name.toLowerCase(),
      image,
      subject,
      difficulty,
      type:type?type:"Standard"
    }).save();

    findSubject.topics.push(newTopic._id);
    await findSubject.save();

    res.status(200).json(newTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.updatetopic = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let data = await topicModel.findById(id);
    if (!data) {
      throw Error("invalid id");
    } else {
      if (
        req.body.difficulty &&
        !["Beginner", "Medium", "Advanced"].includes(req.body.difficulty)
      ) {
        throw new Error(
          "difficulty is not valid. it only be Beginner,Medium or Advanced "
        );
      }
      if (req.body.name) {
        req.body.name = req.body.name.toLowerCase();
        const findTopic = await topicModel.findOne({ name: req.body.name });
        if (findTopic) {
          throw new Error(
            "Topic with this name already exists in this subject"
          );
        }
      }
      const { name, image, difficulty } = req.body;
      req.body = { name, image, difficulty };
      for (let prop in req.body) {
        if (req.body[prop] === null || req.body[prop] === undefined) {
          delete req.body[prop];
        }
      }
      const updated = await topicModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });

      return res.json({
        success: true,
        data: updated,
        message: "topic updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ mesage: error.message });
  }
});

exports.getAlltopicsbysubject = asyncHandler(async (req, res) => {
  const { subject } = req.query;
  try {
    const findTopicLesson = await topicModel.find({ subject });

    if (!findTopicLesson) {
      throw new Error("Topics not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, findTopicLesson, "lesson found sucessfully"));
  } catch (error) {
    res.status(500).json({ mesage: "error.message" || "somthing went wrong" });
  }
});

exports.deletetopic = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    let data = await topicModel.findById(id);
    if (!data) {
      throw Error("invalid id");
    }

    const findsubject = await subjectModel.findById(data.subject);
    findsubject.topics.pop(id);
    await findsubject.save();
    await topicModel.findOneAndDelete({ _id: id });
    return res.json({
      success: true,
      message: "topic deleted successfully",
    });
  } catch (error) {
    const errorMessage = error.message || "something went wrong";
    return res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, errorMessage));
  }
});

exports.addlesson = asyncHandler(async (req, res) => {
  try {
    const { name, pages, content, image, lang, topic } = req.body;
    let words = content.length;
    const findtopic = await topicModel.findById(topic);
    if (!findtopic) {
      throw Error("Invalid topic Entered");
    }
    const alreadylesson = await LessonsModel.find({
      name: name.toLowerCase(),
      topic,
    });
    if(alreadylesson){
        throw Error("This lesson already added")
    }
    const data = await new LessonsModel({
      name: name.toLowerCase(),
      pages,
      content,
      image,
      lang,
      topic,
      words,
    }).save();
    findtopic.lessons.push(data._id);
    await findtopic.save();

    return res.json({
      success: true,
      data,
      message: "Lesson added successfully",
    });
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res.status(500).json(new ApiResponse(500, errorMessage));
  }
});

exports.updatelesson = asyncHandler(async (req, res) => {
  try {
    const findLesson = await LessonsModel.findById(req.params.id);
    if (!findLesson) {
      return res.status(404).json(new ApiResponse(404, "Lesson not found"));
    }

    const { name, pages, content, image, lang, topic } = req.body;

    req.body = { name, pages, content, image, lang, topic };
    for (let prop in req.body) {
      if (req.body[prop] === null || req.body[prop] === undefined) {
        delete req.body[prop];
      }
    }
    if (req.body.content.length > 0) {
      req.body.words = req.body.content.length;
    }
    const update = await LessonsModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    );
    return res.json({
      success: true,
      data: update,
      message: "Lesson updated successfully",
    });
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res.status(500).json(new ApiResponse(500, errorMessage));
  }
});
exports.getcontentOfLesson = asyncHandler(async (req, res) => {
  const LessonId = req.params.id;

  try {
    const findLesson = await LessonsModel.findById(LessonId);

    if (!findLesson) {
      return res.status(404).json(new ApiResponse(404, "Lesson not found"));
    }

    return res.status(200).json({
      message: "Content Found",
      data: findLesson,
    });
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res.status(500).json(new ApiResponse(500, errorMessage));
  }
});

exports.getAllLessonsOfTopics = asyncHandler(async (req, res) => {
  const topicId = req.params.id;
  try {
    const findTopicLesson = await topicModel
      .findById(topicId)
      .populate({ path: "lessons", select: "_id name image" });
    if (!findTopicLesson) {
      throw new Error("Topic not found");
    }
    const Lessons = findTopicLesson.lessons;
    return res
      .status(200)
      .json(new ApiResponse(200, Lessons, "lesson found sucessfully"));
  } catch (error) {
    res.status(500).json({ mesage: "error.message" || "somthing went wrong" });
  }
});
