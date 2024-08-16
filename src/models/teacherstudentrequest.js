
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const teacherstudentrequestSchema = new Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    status: {
      type: String,
      enum: ["Pending", "Complete", "Rejected"],
      default: "Pending",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

const teacherstudentrequestModel = mongoose.model(
  "teacherstudentrequest",
  teacherstudentrequestSchema
);
module.exports = teacherstudentrequestModel;
