const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  likeItem,
  unlikeItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/items", getClothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemId", deleteClothingItem);

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", unlikeItem);

module.exports = router;
