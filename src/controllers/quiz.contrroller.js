const asyncHandler = require("../utils/asyncHandler");
// setInterval(() => {
//     console.log("0")
//     console.clear()
// }, (2000));
exports.addquiz = asyncHandler(async (req, res) => {
  try {
    
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.updatestatusquiz = asyncHandler(async (req, res) => {
  try {
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
exports.getquizes = asyncHandler(async (req, res) => {
  try {
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
exports.addananswer = asyncHandler(async (req, res) => {
  try {
    return res.send({
      success: true,
      data: feedbackdata,
      message: "Feedback done successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
