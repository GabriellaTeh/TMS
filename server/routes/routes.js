const express = require("express");
const router = express.Router();

const {
  loginUser,
  createUser,
  viewUsers,
  viewProfile,
  updateEmail,
  updatePassword,
  updateEmailAdmin,
  updatePasswordAdmin,
  disableUser,
  activateUser,
  createAdmin,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedAdmin } = require("../middleware/auth");

const { checkGroup } = require("../controllers/groupController");

//admin insert
router.route("/").post(createAdmin);

//user
router.route("/user/login").post(loginUser);
router.route("/user/profile").get(isAuthenticatedUser, viewProfile);
router.route("/user/updateEmail").put(isAuthenticatedUser, updateEmail);
router.route("/user/updatePassword").put(isAuthenticatedUser, updatePassword);

//admin
router.route("/users").get(isAuthenticatedUser, viewUsers);
router
  .route("/user/createUser")
  .post(isAuthenticatedUser, authorizedAdmin, createUser);
router
  .route("/user/updateEmailAdmin")
  .put(isAuthenticatedUser, authorizedAdmin, updateEmailAdmin);
router
  .route("/user/updatePasswordAdmin")
  .put(isAuthenticatedUser, authorizedAdmin, updatePasswordAdmin);
router
  .route("/user/disableUser")
  .put(isAuthenticatedUser, authorizedAdmin, disableUser);
router
  .route("/user/activateUser")
  .put(isAuthenticatedUser, authorizedAdmin, activateUser);

//group
router.route("/group/checkGroup").get(isAuthenticatedUser, checkGroup);

module.exports = router;
