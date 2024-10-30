const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, signUp } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", signUp);
router.get("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);
router.use("/", clothingItemRouter);

module.exports = router;
