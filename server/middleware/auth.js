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
    res.send(false);
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
            // res.send("Inactive");
            res.send(false);
          }
        }
      );
    } catch (err) {
      res.send(false);
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
    res.send(false);
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
              res.send(false);
            }
          } else {
            res.send(false);
          }
        }
      );
    } catch (err) {
      res.send(false);
    }
  }
};
