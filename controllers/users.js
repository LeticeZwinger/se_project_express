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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching users." });
    });
};
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  // Get user by ID
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while retrieving user data" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED).send({
        message: `${email} // ${password} ${err} -Incorrect email or password`,
      });
    });
};

const signUp = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw "User already exists!";
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
        res.status(201).send(userData);
      }
    })
    .catch((err) => {
      if (err === "User already exists!") {
        res.status(CONFLICT).send({ message: "Email already exists" });
      }
      console.error("ERROR CODE:", err.code);
      console.error("ERROR:", err);

      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }

      res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error occurred while creating the user.",
      });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error("UserNotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.message === "UserNotFound") {
        res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }

      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
      res.send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }

      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while updating the profile" });
    });
};

module.exports = {
  getUsers,
  signUp,
  getUserById,
  login,
  getCurrentUser,
  updateUser,
};
