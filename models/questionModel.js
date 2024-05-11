var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  answerText: { type: String, required: true },
  answeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answeredAt: { type: Date, default: Date.now },
});

var Answer = mongoose.model("Answer", answerSchema);

var questionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postedAt: { type: Date, default: Date.now },
  answers: [answerSchema],
  acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },
});

var Question = mongoose.model("Question", questionSchema);

module.exports = { Question, Answer };
