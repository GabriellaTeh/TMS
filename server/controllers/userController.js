const database = require("../config/db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username && password && email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    database.query(
      "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email],
      function (error, results) {
        if (error) {
          console.log(error);
        } else {
          res.json({ message: "Create user successful" });
        }
      }
    );
  } else {
    res.send("Please enter Username, password and email!");
  }
};

exports.viewUsers = (req, res, next) => {
  database.query("SELECT * FROM accounts", function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};

exports.viewProfile = (req, res, next) => {
  const userId = req.userId;
  database.query(
    "SELECT * FROM accounts WHERE id = ?",
    [userId.id],
    function (err, results) {
      if (err) {
        console.log(err);
      } else if (results.length === 0) {
        res.status(500).json("Error fetching details");
      } else {
        res.json({ username: results[0].username, email: results[0].email });
      }
    }
  );
};
