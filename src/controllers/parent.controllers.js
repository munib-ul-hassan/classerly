const { json } = require("express");
const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendemail");
const { isValidObjectId } = require("mongoose");
const ApiError = require("../utils/Apierror");
const teacherModel = require("../models/teacher");
const FeedbackModel = require("../models/feedback");

exports.addNewChild = asyncHandler(async (req, res) => {
  const { stdid } = req.body;
  //   if (!isValidObjectId(parentId)) {
  //     return res.status(400).json({ message: "Invalid parent ID format" });
  //   }
  try {
    const findParent = await ParentModel.findById({
      _id: req.user.profile._id,
    });
    const child = await StudentModel.findOne({ code: stdid });

    if (!child) {
      return res.status(400).json({ error: "Invalid child ID" });
    }

    findParent.childIds.push(child._id);
    findParent.save();

    res
      .status(200)
      .json(new ApiResponse(200, findParent, "child added successfully"));
  } catch (error) {
    console.error("Error in sign-up:");

    res.status(500).json({ error: error.message });
  }
});

exports.getMyChilds = asyncHandler(async (req, res) => {
  try {
    const findMychilds = await ParentModel.findOne({
      _id: req.user?.profile?._id,
    }).populate({
      path: "childIds",
      select: "-password",
      populate: [
        { path: "grade", select: "-students" },
        { path: "auth", select: "-password" },
      ],
    });
    console.log();
    const childs = findMychilds.childIds;
    res
      .status(200)
      .json(new ApiResponse(200, childs, "childs founded succesfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
exports.addfeedback = asyncHandler(async (req, res) => {
  try {
    const { teacher, feedback, star, grade } = req.body;
    const existTeacher = await teacherModel.findOne({ _id: teacher });
    const existfeedback = await FeedbackModel.findOne({
      teacher,
      parent: req.user.profile._id,
      grade,
    });

    if (!existTeacher) {
      throw new ApiError(409, "Invalid teacher id");
    }
    if (existfeedback) {
      throw new ApiError(409, "already added feedback");
    }
    if (star > 5) {
      throw new ApiError(409, "value of star must be equal to or less than 5");
    }
    console.log(req.user)
    const feedbackdata = await new FeedbackModel({
      parent: req.user.profile._id,
      grade,
      teacher,
      feedback,
      star: parseInt(star),
    }).save();
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
exports.updatefeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, star } = req.body;

    const existfeedback = await FeedbackModel.findOne({
      _id: id,
      parent: req.user.profile._id,
    });

    if (!existfeedback) {
      throw new ApiError(409, "Invalid id");
    }
    if (star && star > 5) {
      throw new ApiError(409, "value of star must be equal to or less than 5");
    }
    const feedbackdata = await FeedbackModel.findOneAndUpdate(
      {
        _id: id,
        parent: req.user.profile._id,
      },
      {
        feedback,
        star: parseInt(star),
      },
      { new: true }
    );
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback update successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
exports.myFeedBacks = asyncHandler(async (req, res) => {
  
  try {
    const findTeacher = await FeedbackModel.find({ parent:req.user.profile._id })
      .populate({
        path: "teacher",
        select: "-feedback",
        populate:{path:"auth",
        select: "-password"
      } // Exclude the 'password' field
      })
      

    
    res.status(201).json(
      new ApiResponse(200, findTeacher, "feedbacks Found Successfully")
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});
