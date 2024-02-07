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
        "SELECT * FROM accounts WHERE username = ?",
        [username],
        function (err, results) {
          if (err) {
          } else if (results[0].isActive === 1) {
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
      database.query(
        "SELECT * FROM accounts WHERE username = ? ",
        [username],
        function (err, results) {
          if (err) {
            console.log(err);
          } else if (results.length === 1) {
            //valid token and active user
            const groups = results[0].groupNames.split(",");
            if (groups.includes("admin") && results[0].isActive === 1) {
              next();
            } else {
              res.json(false);
            }
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
