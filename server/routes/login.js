const express = require("express");
const router = express.Router();

const { login } = require("../server/controllers/loginController");

router.route("/").post(login);

module.exports = router;
