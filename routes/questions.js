var express = require("express");
var router = express.Router();
var questionController = require("../controllers/questionController");

router.get("/publish", questionController.showPublish);
router.get("/:id", questionController.showQuestion);

router.post("/publish", questionController.publishQuestion);
router.post("/:id/accept", questionController.acceptAnswer);
router.post("/:id/answer", questionController.answer);

module.exports = router;
