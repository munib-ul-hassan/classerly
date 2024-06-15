const mongoose = require("mongoose");

const questionsSchema = new Schema(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    questions: { type: String },
    options: [{ type: String }],
    answer: { type: String },
    time: Number,
  },
  {
    timestamps: true,
  }
);

const QuestionsModel = mongoose.model("Questions", questionsSchema);
module.exports = QuestionsModel;
