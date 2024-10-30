const router = require("express").Router();
const {
  getUserById,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/:userId", getUserById);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
