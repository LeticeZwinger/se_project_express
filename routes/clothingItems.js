const router = require("express").Router();

const {
  createClothingItem,
  likeItem,
  unlikeItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.post("/items", createClothingItem);
router.delete("/items/:itemId", deleteClothingItem);

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", unlikeItem);

module.exports = router;
