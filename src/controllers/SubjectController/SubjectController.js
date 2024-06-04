const subjectModel = require("../../models/subject");
const gradeModel = require("../../models/grade.models");
const { findOne } = require("../../models/student");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/Apierror");
const asyncHandler = require("../../utils/asyncHandler");

exports.AddSubject = asyncHandler(async (req, res) => {
  const { name, grade } = req.body;

  try {
    const gradedata = await gradeModel.findById(grade);

    if (!gradedata) {
      throw new Error("Grade not found");
    }

    const newSubject = await new subjectModel({
      name: name.toLowerCase(),
      grade
    }).save();
    gradedata.subjects.push(newSubject._id);
    await gradedata.save();
    res.status(200).json({
      success: true,
      message: "Subject created",
      data: newSubject
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});
exports.getAllsubjectsbygrade = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    let data = await subjectModel.find({ grade: id }).populate(["grade","topics","teacher"]);
    if (data.length > 0) {
      return res.json({
        success: true,
        data,
        message: "All subjects of grade find successfully"
      });
    } else {
      return res.json({ success: false, data: [], message: "no data found" });
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});


exports.getAlltopicsofsubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  try {
    const topicsOfSubject = await subjectModel
      .findById({ _id: subjectId })
      .populate("subjectTopics");
    if (!topicsOfSubject) {
      throw new Error("Subject not found");
    }
    const subjectTopics = topicsOfSubject.subjectTopics;
    res
      .status(201)
      .json(new ApiResponse(200, subjectTopics, "Topics Found Succesfuly"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteSubject = asyncHandler(async (req, res) => {
  const subjectId = req.params.id;
  console.log(subjectId);
  try {
    const findsubject = await subjectModel.findById({ _id: subjectId });
    if (!findsubject) {
      throw new Error("subject not found");
    }
    const findgrade = await gradeModel.findById(findsubject.gradeId);
    if (!findgrade) {
      throw new Error(500, "Grade not found");
    }
    //  const findSubjectInteracher=await
    findgrade.gradeSubjects = findgrade.gradeSubjects.filter(
      (subject) => subject._id.toString() == !subjectId
    );
    await findgrade.save();

    await findsubject.deleteOne();
    res
      .status(200)
      .json(new ApiResponse(0.2, findsubject, "subject deleted successfuly"));
  } catch (error) {
    const errorMessage = error.message || "something went wrong";
    return res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, errorMessage));
  }
});
