const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while retrieving user data" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({
          message: "Incorrect email or password",
        });
      }

      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An unexpected error occurred",
      });
    });
};

const signUp = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("User already exists!");
      }
      return User.create({
        name,
        avatar,
        email,
        password,
      });
    })
    .then((user) => {
      if (user) {
        const userData = {
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        };
        return res.status(201).send(userData);
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: " Failed to create user" });
    })
    .catch((err) => {
      if (err === "User already exists!") {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      console.error("ERROR CODE:", err.code);
      console.error("ERROR:", err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error occurred while creating the user.",
      });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while updating the profile" });
    });
};

module.exports = {
  signUp,
  login,
  getCurrentUser,
  updateUser,
};
