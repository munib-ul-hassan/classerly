const cloud = require("../config/cloudnaryconfig");
const asyncHandler = require("../utils/asyncHandler");

exports.upload = asyncHandler(async (req, res, next) => {
  try {
    await cloud.uploader.upload(
      "src/uploads/" + req.file.filename,
      (err, result) => {
        
        // if (err) {
        //   return res.send({ success: false, message: err.message });
        // }

        return res.send({ success: true, file: err?.url});
      }
    );
  } catch (e) {
    res.status(200).json({ success: false, message: e.message });
  }
});
