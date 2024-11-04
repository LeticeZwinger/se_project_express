const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, signUp } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", signUp);
router.get("/items", getClothingItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/", clothingItemRouter);

module.exports = router;
