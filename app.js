const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();
const helmet = require("helmet");
const listEndpoints = require("express-list-endpoints");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
const errorHandler = require("./middlewares/errorHandler");
const mainRouter = require("./routes/index");
const limiter = require("./middlewares/rateLimit");

mongoose.set("strictQuery", false);
const NotFoundError = require("./errors/NotFoundError");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use(helmet());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(limiter);
app.use("/", mainRouter);

const endpoints = listEndpoints(app);
console.log("Registered routes:");
endpoints.forEach((endpoint) => {
  endpoint.methods.forEach((method) => {
    console.log(`${method} ${endpoint.path}`);
  });
});

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
