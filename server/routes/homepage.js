const express = require("express");
const router = express.Router();

const { getHome } = require("../server/controllers/homeController");

router.route("/home").get(getHome);

module.exports = router;