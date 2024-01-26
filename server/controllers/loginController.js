const database = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [username],
      async function (error, results) {
        if (error) {
          console.log(error);
        } else if (results.length === 0) {
          res.status(401).json({ message: "Invalid username/password" });
        } else {
          const match = await bcrypt.compare(password, results[0].password);
          if (match) {
            const token = jwt.sign({ userId: results[0] }, "my_secret_key", {
              expiresIn: "1h",
            });
            res.status(200).json({ message: "Login successful", token });
          } else {
            res.status(401).json({ message: "Invalid username/password" });
          }
        }
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
};
