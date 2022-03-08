// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");

// internal imports
const homeRouter = require("./router/homeRouter");
const authRouter = require("./router/authRouter");

const { notFoundHandler, errorHandler } = require("./app/middleware/commonErrorHandleMiddleware");

const app = express();
const server = http.createServer(app);
dotenv.config();

// set comment as app locals
app.locals.moment = moment;

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// set view engine
// app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
// app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/", homeRouter);
app.use("/api/auth", authRouter);
// app.use("/users", usersRouter);
// app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`App listening to port = http://localhost:${process.env.PORT}`);
});