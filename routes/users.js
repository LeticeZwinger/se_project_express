const router = require("express").Router();
const { validateUserBody } = require("../middlewares/validation");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", validateUserBody, updateUser);

module.exports = router;
