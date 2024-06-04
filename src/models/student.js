const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const studentSchema = new Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
    grade:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"grade"
  },
  code:{
    type:String,unique:true
  },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "parent" },
    opinionEmail:{
        type:Boolean,
    },reminderEmail:{
        type:Boolean,
    },
    newEmail:{
        type:Boolean,
    },
    reminder:{
        type:Boolean,
    },
    quizReminder:{
        type:Boolean,
    },
    gamesReminder:{
        type:Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("Student", studentSchema);
module.exports = studentModel;
