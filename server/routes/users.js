const express = require("express");
const router = express.Router();

const { createUser, viewUsers } = require("../controllers/userController");

router.route("/users").post(createUser);
router.route("/users").get(viewUsers);

module.exports = router;
