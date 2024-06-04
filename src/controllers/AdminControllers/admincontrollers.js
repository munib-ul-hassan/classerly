const EventModel = require("../../models/UpcommingEvents/Events");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");


exports.AdminAddEvent=asyncHandler(async(req,res)=>{
    const {eventName}=req.body;
    const event=eventName.toLowerCase();
    try {
        const findEvent=await EventModel.findOne({eventName:event});
        if(findEvent){
            throw new Error("Event Already exist")
        }
        const upcomingEvent=await EventModel.create({
            eventName:event
        })
        await upcomingEvent.save();
        res.status(200).json({
            success:true,
            message:"Event Created Successfuly",

        })
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
})