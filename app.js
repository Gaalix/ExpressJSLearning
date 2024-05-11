var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");

mongoose.connect(
  "",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var questionsRouter = require("./routes/questions");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var session = require("express-session");
var mongoStore = require("connect-mongo");
app.use(
  session({
    secret: "lego ninjago",
    resave: true,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl:
        "mongodb+srv://borincgal:password2003@school.myk6u1p.mongodb.net/?retryWrites=true&w=majority&appName=school",
    }),
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
