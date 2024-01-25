const express = require("express");
const router = express.Router();

const { viewHome } = require("../controllers/homeController");

router.route("/home").get(viewHome);

module.exports = router;
