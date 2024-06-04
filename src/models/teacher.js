const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const teacherSchema = new Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "grade",
    },
    feedback: [
      {
        feedbackFrom: {
          type: String,
          enum: ["parent", "student"],
          required: true,
        },
        feedbackText: {
          type: String,
          required: true,
        },
        feedbackBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "feedback.feedbackFrom",
        },
      },
    ],
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    }],
  },
  {
    timestamps: true,
  }
);

const teacherModel = mongoose.model("Teacher", teacherSchema);
module.exports = teacherModel;
