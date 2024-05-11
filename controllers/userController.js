var userModel = require("../models/userModel.js");

module.exports = {
  showRegister: function (req, res) {
    res.render("register", { title: "Register" });
  },

  showLogin: function (req, res) {
    res.render("login", { title: "Login" });
  },

  register: function (req, res) {
    var user = new userModel({
      username: req.body.username,
      password: req.body.password,
    });
    user.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("login");
      }
    });
  },

  login: function (req, res) {
    userModel.authenticate(
      req.body.username,
      req.body.password,
      function (err, user) {
        if (err || !user) {
          var err = new Error("Wrong email or password.");
          err.status = 401;
          res.send(err);
        } else {
          req.session.userId = user._id;
          res.redirect("profile");
        }
      }
    );
  },

  logout: function (req, res) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect("/");
        }
      });
    }
  },

  showProfile: function (req, res) {
    userModel.findById(req.session.userId).exec(function (err, user) {
      if (err) {
        res.send(err);
      } else {
        if (user == null) {
          res.redirect("login");
        }
        res.render("profile", { user: user });
      }
    });
  },

  showUser: function (req, res) {
    userModel.findById(req.params.id).exec(function (err, user) {
      if (err) {
        res.send(err);
      }
      res.render("profile", { user: user });
    });
  },

  updateUser: function (req, res) {
    userModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      function (err, user) {
        if (err) {
          res.status(500).send({
            message: "Could not update user with id " + req.params.id,
          });
        }
        res.send(user);
      }
    );
  },

  deleteUser: function (req, res) {
    userModel.findByIdAndRemove(req.params.id, function (err, user) {
      if (err) {
        res
          .status(500)
          .send({ message: "Could not delete user with id " + req.params.id });
      }
      res.send({ message: "User deleted successfully!" });
    });
  },
};
