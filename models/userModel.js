var mongoose = require("mongoose");
var bycrypt = require("bcrypt");
const { use } = require("../routes/users");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bycrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bycrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bycrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.statics.authenticate = function (username, password, cb) {
  this.findOne({ username: username }, function (err, user) {
    if (err) return cb(err);
    if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return cb(err);
    }
    user.comparePassword(password, function (err, isMatch) {
      if (err) return cb(err);
      if (isMatch) return cb(null, user);
      var err = new Error("Incorrect password.");
      err.status = 401;
      return cb(err);
    });
  });
};

var User = mongoose.model("User", userSchema);
module.exports = User;
