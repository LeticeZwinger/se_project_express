const router = require("express").Router();
const { validateUserUpdateBody } = require("../middlewares/validation");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", validateUserUpdateBody, updateUser);

module.exports = router;
