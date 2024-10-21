const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mainRouter = require("./routes/index");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
