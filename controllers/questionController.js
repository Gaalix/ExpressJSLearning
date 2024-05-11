var { Question } = require("../models/questionModel.js");

module.exports = {
  showQuestion: function (req, res) {
    Question.findById(req.params.id)
      .populate({
        path: "answers",
        model: "Answer",
        populate: {
          path: "answeredBy",
          model: "User",
          select: "username -_id",
        },
      })
      .exec(function (err, question) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error fetching question", error: err });
        } else if (!question) {
          res.status(404).send({ message: "Question not found" });
        } else {
          if (question.acceptedAnswer) {
            res.status(200).render("question", {
              question: question,
              answers: question.answers,
              acceptedAnswer: question.acceptedAnswer,
            });
          } else {
            res.status(200).render("question", {
              question: question,
              answers: question.answers,
              acceptedAnswer: null,
            });
          }
        }
      });
  },

  showPublish: function (req, res) {
    res.render("publish");
  },

  publishQuestion: function (req, res) {
    if (!req.session.userId) {
      res.status(401).send({ message: "Unauthorized" });
    }
    var question = new Question({
      title: req.body.title,
      description: req.body.description,
      postedBy: req.session.userId,
    });
    question.save(function (err, question) {
      if (err) {
        res
          .status(500)
          .send({ message: "Error publishing question", error: err });
      }
      res.status(200).redirect("/");
    });
  },

  answer: function (req, res) {
    if (!req.session.userId) {
      res.status(401).send({ message: "Unauthorized" });
    }
    Question.findById(req.body.questionId, function (err, question) {
      if (err) {
        res
          .status(500)
          .send({ message: "Error fetching question", error: err });
      } else if (!question) {
        res.status(404).send({ message: "Question not found" });
      } else {
        question.answers.push({
          answerText: req.body.answerText,
          answeredBy: req.session.userId,
        });
        question.save(function (err, question) {
          if (err) {
            res
              .status(500)
              .send({ message: "Error answering question", error: err });
          }
          res.status(200).redirect("/");
        });
      }
    });
  },

  acceptAnswer: function (req, res) {
    if (!req.session.userId) {
      res.status(401).send({ message: "Unauthorized" });
    }
    Question.findById(req.body.questionId, function (err, question) {
      if (err) {
        res
          .status(500)
          .send({ message: "Error fetching question", error: err });
      } else if (!question) {
        res.status(404).send({ message: "Question not found" });
      } else {
        question.acceptedAnswer = req.body.answerId;
        question.save(function (err, question) {
          if (err) {
            res
              .status(500)
              .send({ message: "Error accepting answer", error: err });
          }
          res.status(200).redirect("/");
        });
      }
    });
  },
};
