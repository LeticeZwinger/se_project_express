const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching clothing items." });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while creating the item." });
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
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid clothing item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getClothingItems, createClothingItem, getClothingItemById };
