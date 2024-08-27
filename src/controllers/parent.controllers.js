const { json } = require("express");
const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendemail");
const { isValidObjectId } = require("mongoose");
// const ApiError = require("../utils/Apierror");
const teacherModel = require("../models/teacher");
const FeedbackModel = require("../models/feedback");
const StudentquizesModel = require("../models/studentquizes");

exports.addNewChild = asyncHandler(async (req, res) => {
  const { stdid } = req.body;
  //   if (!isValidObjectId(parentId)) {
  //     return res.status(200).json({ message: "Invalid parent ID format" });
  //   }
  try {
    const findParent = await ParentModel.findById({
      _id: req.user.profile._id,
    });
    const child = await StudentModel.findOne({ code: stdid });

    if (!child) {
      return res.status(200).json({ message: "Invalid child ID" });
    }

    findParent.childIds.push(child._id);
    findParent.save();

    res
      .status(200)
      .json(new ApiResponse(200, findParent, "child added successfully"));
  } catch (error) {
    console.error("Error in sign-up:");

    res.status(200).json({ message: error.message });
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
        {
          path: "grade",
          select: ["grade", "subjects"],
          populate: { path: "subjects", select: ["image", "name"] },
        },
        { path: "auth", select: "-password" },
      ],
    });

    const childs = findMychilds.childIds;
    res
      .status(200)
      .json(new ApiResponse(200, childs, "childs founded succesfully"));
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

exports.myFeedBacks = asyncHandler(async (req, res) => {
  try {
    const {id}= req.params
    const findTeacher = await FeedbackModel.find({
      to: id,
    }).populate({
      path: "from",
      select: "-feedback",
      populate: { path: "auth", select: ["fullName","image","profile"] }, // Exclude the 'password' field
    });

    res
      .status(200)
      .json(new ApiResponse(200, findTeacher, "feedbacks Found Successfully"));
  } catch (error) {
    return res
      .status(200)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
});
exports.getQuizInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await StudentquizesModel.find({ student: id ,status:"complete"}).populate({path:"quiz",populate:{path:"subject"}});
    return res
      .status(200)
      .json({ success: true, data, message: "Quiz data found Successfully" });
  } catch (error) {
    return res
      .status(200)
      .json({
        success: false,
        message: error.message || "Something went wrong",
      });
  }
};
