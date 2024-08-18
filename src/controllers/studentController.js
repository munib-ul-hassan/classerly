const FeedbackModel = require("../models/feedback");
const teacherModel = require("../models/teacher");
const teacherstudentrequestModel = require("../models/teacherstudentrequest");
const asyncHandler = require("../utils/asyncHandler");

exports.getmyrequests = async (req, res) => {
  try {
    let data = await teacherstudentrequestModel.find({
      student: req.user?.profile?._id,
      status: "Pending",
    }).populate({path:"teacher", select:"auth" ,populate:{path:"auth", select:["userName","fullName","email","image","fullAddress"]}});
    return res.send({
      success: true,
      data,
      message: "requests get Successfully",
    });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

exports.updaterequest= async (req,res)=>{
    try{
        const {id}= req.params
        const {status}=req.body
        if(status!="Completed"&&status!="Rejected"){
            return res.send({
                success: false,                
                message: "Invalid Status",
              });
        }
        const data = await teacherstudentrequestModel.findById(id)
        if(!data){
            return res.send({
                success: false,                
                message: "Invalid Request",
              });
        }
        await teacherstudentrequestModel.findOneAndUpdate({_id:id},{status})
        if(status=="Completed"){
            await teacherModel.findOneAndUpdate({_id:data.teacher},{$addToSet:{students:req.user?.profile?._id}})
        }

        return res.send({
            success: true,                
            message: "Request updated successfully",
          });
    }catch (error) {
        return res.status(200).json({ success: false, message: error.message });
      }
}
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
      throw new Error("Invalid teacher id");
    }
    if (existfeedback) {
      throw new Error("already added feedback");
    }
    if (star > 5) {
      throw new Error("value of star must be equal to or less than 5");
    }
    if(!existTeacher.students.includes(req.user.profile._id)){
      throw new Error("You can't add feedback for this teacher");

    }
    const feedbackdata = await new FeedbackModel({
      childern: req.user.profile._id,
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
    res.status(200).json({ success: false, message: error.message });
  }
});
exports.updatefeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, star } = req.body;

    const existfeedback = await FeedbackModel.findOne({
      _id: id,
      childern: req.user.profile._id,
    });

    if (!existfeedback) {
      throw new Error("Invalid id");
    }
    if (star && star > 5) {
      throw new Error("value of star must be equal to or less than 5");
    }
    const feedbackdata = await FeedbackModel.findOneAndUpdate(
      {
        _id: id,
        childern: req.user.profile._id,
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
    res.status(200).json({ message: error.message });
  }
});

exports.getmyteacher= async (req,res)=>{
  try{
    let data = await teacherModel.find({
      students:{$in:req.user.profile._id}
    }).populate("auth")
    return res.send({
      success: true,         
      data,       
      message: "Teachere get successfully",
    });
  }
  catch (error) {
    res.status(200).json({ message: error.message });
  }
}