const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");
const { login, signUp } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.post("/signup", validateUserBody, signUp);
router.post("/signin", validateLoginBody, login);
router.get("/items", getClothingItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/", clothingItemRouter);

module.exports = router;
