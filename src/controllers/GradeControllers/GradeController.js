const gradeModel = require("../../models/grade.models");
const { findById } = require("../../models/student");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

// exports.deleteGrade = asyncHandler(async (req, res) => {
//   try {
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// });

// exports.updateGrade = asyncHandler(async (req, res) => {
//   try {
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// });

exports.addGrade = asyncHandler(async (req, res) => {
  const { grade } = req.body;
  try {
    const findSamegrade = await gradeModel.findOne({ grade });

    if (findSamegrade) {
      throw Error("grade already exist");
    }
    const savegrade = new gradeModel({
      grade
    });

    await savegrade.save();
    return res.status(200).json({ success: true, data: savegrade });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

exports.getAllGrades = asyncHandler(async (req, res) => {
  try {
    const allgrades = await gradeModel
      .find()
      .populate(["students", "subjects", "teachers"]);
    return res.status(200).json({
      success: true,
      message: "All grades get succesfully",
      data: allgrades
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// exports.getAllSubjectsOfGrade = asyncHandler(async (req, res) => {
//   const gradeId = req.params.id;
//   try {
//     const findgrade = await gradeModel
//       .findById({ _id: gradeId })
//       .populate("gradeSubjects");

//     if (!findgrade) {
//       res.status(404).json("grade not found");
//     }
//     const subjects = findgrade.gradeSubjects;

//     res.status(200).json(new ApiResponse(200, subjects, "found sucsessfully"));
//   } catch (e) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// });
