const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((user) => {
      console.error(err);
      if (err.name === "ValidatorError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((user) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // add an apropriate return for this error
      } else if ( 
        // handle the cast error (bad request, perhaps?)
        )
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUserById };
