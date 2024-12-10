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

const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const conflictError = require("../errors/conflictError");
const ForbiddenError = require("../errors/ForbiddenError");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.send(user);
    })
    .catch(next);
};

const UnauthorizedError = require("../errors/unauthorized-err");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const signUp = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError("All fields are required"));
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
      return User.create({ name, avatar, email, password });
    })
    .then((user) => {
      const userData = {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data passed"));
      } else {
        next(err);
      }
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
