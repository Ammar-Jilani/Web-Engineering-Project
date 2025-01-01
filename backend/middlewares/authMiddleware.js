const jwt = require("jsonwebtoken");
const { verifyToken } = require("../config/auth");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = verifyToken(token); // Correctly define decoded
    if (!decoded || !decoded.user_id) {
      return res.status(401).send("Invalid Token");
    }

    console.log("Decoded Token:", decoded); // Debug log
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).send("Invalid Token");
  }
};

module.exports = authenticate;
