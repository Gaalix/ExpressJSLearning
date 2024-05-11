var express = require("express");
const userController = require("../controllers/userController");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", userController.showRegister);
router.get("/login", userController.showLogin);
router.get("/logout", userController.logout);
router.get("/profile", userController.showProfile);
router.get("/:id", userController.showUser);

router.post("/register", userController.register);
router.post("/login", userController.login);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
