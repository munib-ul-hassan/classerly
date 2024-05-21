const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// ######################## Topic Schema #####################
const TopicSchema = new Schema(
  {
    topicname: String,
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    difficulty: {
      type: String,
    },
    lessonHours: {
      type: String,
    },
    practiceHours: {
      type: String,
    },
    quizzes: {
      type: String,
    },
    status: {
      type: String,
    },
    subjectName: {
      type: String,
    },
    topicLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const topicModel = mongoose.model("Topic", TopicSchema);
module.exports = topicModel;
