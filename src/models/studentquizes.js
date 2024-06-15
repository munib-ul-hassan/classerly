const mongoose = require("mongoose");

const studentquizesSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    quiz: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quizes",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "start", "complete"],
      default: "pending",
    },
    result: {
      type: String,
      enum: ["awaiting", "pass", "fail"],
      default: "awaiting",
    },

    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const StudentquizesModel = mongoose.model("studentquizes", studentquizesSchema);
module.exports = StudentquizesModel;
