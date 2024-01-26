const express = require("express");
const router = express.Router();

const {
  loginUser,
  createUser,
  viewUsers,
  viewProfile,
  updateEmail,
  updatePassword,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedAdmin } = require("../middleware/auth");

const { checkGroup } = require("../controllers/groupController");

//user
router.route("/user/login").post(loginUser);
router.route("/user/profile").get(isAuthenticatedUser, viewProfile);
router.route("/user/updateEmail").post(isAuthenticatedUser, updateEmail);
router.route("/user/updatePassword").post(isAuthenticatedUser, updatePassword);

//admin
router.route("/users").get(viewUsers);
router
  .route("/user/createUser")
  .post(isAuthenticatedUser, authorizedAdmin, createUser);

//group
router.route("/group/checkGroup").get(isAuthenticatedUser, checkGroup);

module.exports = router;
