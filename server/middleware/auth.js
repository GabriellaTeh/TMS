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
      const userId = decoded.id;

      database.query(
        "SELECT isActive FROM accounts WHERE id = ?",
        [userId],
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
      const id = decoded.id;
      const group_name = "admin";
      database.query(
        "SELECT group_name FROM tms.groups WHERE id = ? AND group_name = ? ",
        [id, group_name],
        function (err, results) {
          if (err) {
            console.log(err);
          } else if (results.length === 1) {
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
