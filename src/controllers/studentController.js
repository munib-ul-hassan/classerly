const teacherModel = require("../models/teacher");
const teacherstudentrequestModel = require("../models/teacherstudentrequest");

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
    return res.status(200).json({ success: false, error: error.message });
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
        return res.status(200).json({ success: false, error: error.message });
      }
}
