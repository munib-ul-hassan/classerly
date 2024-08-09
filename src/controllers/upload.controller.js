const asyncHandler = require("../utils/asyncHandler");

exports.upload = asyncHandler(async (req, res) => {
  try {
    return res.send({success:true,file:req.file.filename});
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
