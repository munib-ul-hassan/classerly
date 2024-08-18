const mongoose = require("mongoose");

const { Schema } = require("mongoose");
const teacherModel = require("./teacher");

const FeedbackSchema = new Schema({
  childern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
  },
  feedback: {
    type: String,
  },
  star: Number,
},{
  timestamps:true
});

const FeedbackModel = mongoose.model("feedback", FeedbackSchema);
const changeStream = FeedbackModel.watch();
changeStream.on("change", async (change) => {
  let techerfeedback;
  
  if (change.operationType == "update" || change.operationType == "delete") {
    techerfeedback = await FeedbackModel.find({
      teacher: (
        await FeedbackModel.findOne({ _id: change.documentKey._id })
      ).teacher,
    });
  } else {
    techerfeedback = await FeedbackModel.find({
      teacher: change?.fullDocument?.teacher,
    });
  }
  if (techerfeedback) {
    await teacherModel.findOneAndUpdate(
      { _id: techerfeedback[0].teacher },
      {
        feedback: {
          total: techerfeedback.length,
          counts: {
            1: techerfeedback.filter((i) => {
              return i.star == 1;
            }).length,
            2: techerfeedback.filter((i) => {
              return i.star == 2;
            }).length,

            3: techerfeedback.filter((i) => {
              return i.star == 3;
            }).length,
            4: techerfeedback.filter((i) => {
              return i.star == 4;
            }).length,
            5: techerfeedback.filter((i) => {
              return i.star == 5;
            }).length,
          },
          average:
            techerfeedback.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.star;
            }, 0) / techerfeedback.length,
        },
      }
    );
  }
});
module.exports = FeedbackModel;
