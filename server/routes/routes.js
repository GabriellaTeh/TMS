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
  getPermit,
} = require("../controllers/applicationController");

const {
  getPlans,
  createPlan,
  editPlan,
  getPlanNames,
} = require("../controllers/planController");

const {
  createTask,
  getTasks,
  getTask,
  editTask,
  editTaskWithPlan,
  editTaskWithState,
} = require("../controllers/taskController");

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
router.route("/plans").post(isAuthenticatedUser, getPlans);
router.route("/plan/list").post(isAuthenticatedUser, getPlanNames);
router.route("/plan/create").post(isAuthenticatedUser, createPlan);
router.route("/plan/edit").post(isAuthenticatedUser, editPlan);

//task functions
router.route("/task/create").post(isAuthenticatedUser, createTask);
router.route("/tasks").post(isAuthenticatedUser, getTasks);
router.route("/task").post(isAuthenticatedUser, getTask);
router.route("/task/edit").post(isAuthenticatedUser, editTask);
router.route("/task/editWithPlan").post(isAuthenticatedUser, editTaskWithPlan);
router.route("/task/editState").post(isAuthenticatedUser, editTaskWithState);

//permit functions
router.route("/app/permit").post(isAuthenticatedUser, getPermit);

module.exports = router;
