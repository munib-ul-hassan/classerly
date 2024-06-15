const EventModel = require("../models/Events");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.AdminAddEvent = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const event = name.toLowerCase();
  try {
    const findEvent = await EventModel.findOne({ name: event });
    if (findEvent) {
      throw new Error("Event Already exist");
    }
    const upcomingEvent = await EventModel.create({
      name: event,
    });
    await upcomingEvent.save();
    res.status(200).json({
      success: true,
      data: upcomingEvent,
      message: "Event Created Successfuly",
    });
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res
      .status(error.status || 500)
      .json(new ApiResponse(error.status || 500, errorMessage));
  }
});
