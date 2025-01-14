const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const InternalServerError = require("../errors/InternalServerError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      next(new InternalServerError("Failed to fetch clothing items"))
    );
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for clothing item"));
      } else {
        next(err);
      }
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return ClothingItem.findByIdAndRemove(itemId);
    })
    .then(() =>
      res.status(200).send({ message: "Clothing item deleted successfully" })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid clothing item ID"));
      } else {
        next(err);
      }
    });
};

const getClothingItemById = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
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
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
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
        return next(new BadRequestError("Invalid item ID"));
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
