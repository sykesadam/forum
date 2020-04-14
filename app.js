const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");

require("dotenv").config();
const app = express();

// Passport Config
require("./config/passport")(passport);

//Database
mongoose
	.connect(process.env.DB_CONNECTION_URI, {
		useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Express session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	sassMiddleware({
		src: __dirname + "/public",
		dest: __dirname + "/public",
		indentedSyntax: true, // true = .sass and false = .scss
		// sourceMap: true,
		debug: true,
	})
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
});

module.exports = app;
