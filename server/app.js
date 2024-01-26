const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

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
app.use(cors());

const login = require("./routes/login");
const viewHome = require("./routes/home"); // /home
const users = require("./routes/users"); // /users
app.use(login);
app.use(viewHome);
app.use(users);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
