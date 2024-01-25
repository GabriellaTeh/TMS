const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use();

app.get("/", function (req, res) {
  // Render login template
  res.status(200).send("logged in");
});

const login = require("./routes/login");
const homepage = require("./routes/homepage");
app.use(login);
app.use(homepage);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
