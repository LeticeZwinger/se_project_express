const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  const userId = req.user._id;
  ClothingItem.find({ owner: userId })
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching clothing items." });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while creating the item." });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(new Error("ClothingItemNotFound"))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to delete this item" });
      }
      return ClothingItem.findByIdAndRemove(itemId)
        .then(() =>
          res
            .status(200)
            .send({ message: "Clothing item deleted successfully" })
        )
        .catch((err) => {
          console.error(err);
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error occurred while deleting the item." });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "ClothingItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getClothingItemById = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(new Error("ClothingItemNotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.message === "ClothingItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("ClothingItemNotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.message === "ClothingItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while liking the item." });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("ClothingItemNotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.message === "ClothingItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while unliking the item." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  getClothingItemById,
  likeItem,
  unlikeItem,
  deleteClothingItem,
};
