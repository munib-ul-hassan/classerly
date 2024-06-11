const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// ######################## Topic Schema #####################
const TopicSchema = new Schema(
  {
    name:{type:String,unique:true},
    image:String,

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    difficulty: {
      enum:["Beginner","Medium","Advanced"],
      type: String,
    },
    lessonHours: {
      type: String,
    },
    practiceHours: {
      type: String,
    },
    teacher:{
      type:Schema.Types.ObjectId,
      ref:"Teacher"
   },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons",
      },
    ],
    quizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    practices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practice",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const topicModel = mongoose.model("Topic", TopicSchema);
module.exports = topicModel;
