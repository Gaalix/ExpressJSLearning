var express = require("express");
var router = express.Router();
var { Question } = require("../models/questionModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  Question.find({}, function (err, questions) {
    if (err) {
      return next(err);
    }
    res.render("index", { title: "CopyPasta Overlord", questions: questions });
  });
});
module.exports = router;
