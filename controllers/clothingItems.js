const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      next(new INTERNAL_SERVER_ERROR("Failed to fetch clothing items"))
    );
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      return next(new INTERNAL_SERVER_ERROR("Failed to create clothing item"));
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => new NOT_FOUND("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new FORBIDDEN("You are not authorized to delete this item");
      }
      return ClothingItem.findByIdAndRemove(itemId);
    })
    .then(() =>
      res.status(200).send({ message: "Clothing item deleted successfully" })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid clothing item ID"));
      }
      return next(err);
    });
};

const getClothingItemById = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NOT_FOUND("Clothing item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid clothing item ID"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NOT_FOUND("Clothing item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid item ID"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid item ID"));
      }
      return next(err);
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
