const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createClothingItem,
  likeItem,
  unlikeItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.post("/items", validateCardBody, createClothingItem);
router.delete("/items/:itemId", validateId, deleteClothingItem);

router.put("/items/:itemId/likes", validateId, likeItem);

router.delete("/items/:itemId/likes", validateId, unlikeItem);

module.exports = router;
