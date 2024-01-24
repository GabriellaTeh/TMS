const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");

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
app.use(express.static(path.join(__dirname, "static")));

app.get("/", function (request, response) {
  // Render login template
  response.sendFile(path.join(__dirname + "/login.html"));
});

const login = require("./routes/login");
const homepage = require("./routes/homepage");
app.use(login);
app.use(homepage);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
