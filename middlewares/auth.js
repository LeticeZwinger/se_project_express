const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UNAUTHORIZED("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new UNAUTHORIZED("Authorization required"));
  }
};

module.exports = auth;
