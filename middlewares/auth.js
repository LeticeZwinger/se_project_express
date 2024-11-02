const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { FORBIDDEN, UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(UNAUTHORIZED).send({ message: "Authorization required" });
    return;
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    console.error(err);
    res.status(FORBIDDEN).send({ message: "Authorization required" });
    return;
  }
  return next();
};

module.exports = auth;
