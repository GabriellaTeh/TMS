const express = require("express");
const router = express.Router();

const {
  loginUser,
  createUser,
  viewUsers,
  viewProfile,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedAdmin } = require("../middleware/auth");

router.route("/user/login").post(loginUser);
router.route("/user/profile").get(isAuthenticatedUser, viewProfile);

//admin
router.route("/users").get(viewUsers);
router
  .route("/user/createUser")
  .post(isAuthenticatedUser, authorizedAdmin, createUser);

module.exports = router;
