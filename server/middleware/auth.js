const jwt = require("jsonwebtoken");
const database = require("../config/db");

exports.isAuthenticatedUser = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const decoded = jwt.verify(token, "my_secret_key");
      const username = decoded.username;

      database.query(
        "SELECT isActive FROM accounts WHERE username = ?",
        [username],
        function (err, results) {
          if (err) {
            console.log(err);
          } else if (results[0].isActive == 1) {
            //valid token and active user
            next();
          } else {
            res.json({ message: "User inactive" });
          }
        }
      );
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};
//returns true/false
async function checkGroup(username, group_name) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM tms.groups WHERE username = ? AND group_name = ?",
      [username, group_name],
      function (err, results) {
        if (err) {
          resolve(false);
        }
        if (results.length === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

exports.authorizedAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const decoded = jwt.verify(token, "my_secret_key");
      const username = decoded.username;
      const group_name = "admin";
      const result = await checkGroup(username, group_name);
      // database.query(
      //   "SELECT group_name FROM tms.groups WHERE username = ? AND group_name = ? ",
      //   [username, group_name],
      //   function (err, results) {
      //     if (err) {
      //       console.log(err);
      //     } else if (results.length == 1) {
      //       //valid token and active user
      //       next();
      //     } else {
      //       res.json({ message: "User inactive" });
      //     }
      //   }
      // );
      if (result) {
        next();
      } else {
        res.json({ message: "User is not admin" });
      }
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};