const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    question: { type: String },
    options: [{ type: String }],
    answer: { type: String },
    score: Number,
  },
  {
    timestamps: true,
  }
);

const QuestionsModel = mongoose.model("Questions", questionsSchema);
module.exports = QuestionsModel;
