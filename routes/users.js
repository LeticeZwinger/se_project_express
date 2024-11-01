const router = require("express").Router();
const {
  getUserById,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.get("/:userId", getUserById);
router.patch("/me", updateUser);

module.exports = router;
