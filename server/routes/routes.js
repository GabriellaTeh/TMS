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
  verifyUser,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedAdmin } = require("../middleware/auth");

const {
  addUserToGroup,
  getUserGroups,
  removeUserFromGroup,
  checkUserGroup,
  getGroups,
  createGroup,
} = require("../controllers/groupController");

//admin insert
router.route("/createAdmin").post(createAdmin);

//user
router.route("/user/login").post(loginUser);
router.route("/verify").get(verifyUser);
router.route("/user/profile").get(isAuthenticatedUser, viewProfile);
router.route("/user/updateEmail").put(isAuthenticatedUser, updateEmail);
router.route("/user/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/group/user").get(isAuthenticatedUser, getUserGroups);
router.route("/user/checkGroup").post(isAuthenticatedUser, checkUserGroup);

//admin
router.route("/users").get(isAuthenticatedUser, authorizedAdmin, viewUsers);
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
router.route("/groups").get(isAuthenticatedUser, getGroups);

//admin group functions
router.route("/group/addUser").post(isAuthenticatedUser, addUserToGroup);
router
  .route("/group/removeUser")
  .post(isAuthenticatedUser, removeUserFromGroup);
router
  .route("/group/createGroup")
  .post(isAuthenticatedUser, authorizedAdmin, createGroup);

module.exports = router;
