const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
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
