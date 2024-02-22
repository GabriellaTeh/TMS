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
  createAdmin,
  verifyUser,
  checkActiveUser,
  updateActive,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedAdmin } = require("../middleware/auth");

const {
  getUserGroups,
  checkUserGroup,
  getGroups,
  createGroup,
  updateUserGroup,
} = require("../controllers/groupController");

const {
  createApp,
  getApps,
  getApp,
  editApp,
} = require("../controllers/applicationController");

const { getPlans, createPlan } = require("../controllers/planController");

//admin insert
router.route("/createAdmin").post(createAdmin);

//user
router.route("/user/login").post(loginUser);
router.route("/verify").get(verifyUser);
router.route("/checkActive").get(checkActiveUser);
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
  .route("/user/updateActive")
  .post(isAuthenticatedUser, authorizedAdmin, updateActive);
router.route("/groups").get(isAuthenticatedUser, getGroups);

//admin group functions
router
  .route("/group/createGroup")
  .post(isAuthenticatedUser, authorizedAdmin, createGroup);
router
  .route("/group/update")
  .post(isAuthenticatedUser, authorizedAdmin, updateUserGroup);

//application functions
router.route("/app/create").post(isAuthenticatedUser, createApp);
router.route("/apps").get(isAuthenticatedUser, getApps);
router.route("/app").post(isAuthenticatedUser, getApp);
router.route("/app/edit").post(isAuthenticatedUser, editApp);

//plan functions
router.route("/plans").get(isAuthenticatedUser, getPlans);
router.route("/plan/create").post(isAuthenticatedUser, createPlan);

module.exports = router;
