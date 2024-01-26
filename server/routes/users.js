const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  createUser,
  viewUsers,
  viewProfile,
} = require("../controllers/userController");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const extractedToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(extractedToken, "my_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.route("/users").post(createUser);
router.route("/users").get(viewUsers);
router.route("/profile").get(authenticate, viewProfile);

module.exports = router;
