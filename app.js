const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const errorHandler = require("./middlewares/error-handler");
const listEndpoints = require("express-list-endpoints");
const mainRouter = require("./routes/index");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./utils/errors");

mongoose.set("strictQuery", false);

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(async () => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(cors());

app.use(express.json());

app.use("/", mainRouter);

const endpoints = listEndpoints(app);
console.log("Registered routes:");
endpoints.forEach((endpoint) => {
  endpoint.methods.forEach((method) => {
    console.log(`${method} ${endpoint.path}`);
  });
});

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
