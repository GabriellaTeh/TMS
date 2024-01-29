const database = require("../config/db");
const jwt = require("jsonwebtoken");

//add user to group => /group/addUser
exports.addUserToGroup = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const username = req.body.username;
    const group_name = req.body.group_name;

    database.query(
      "INSERT INTO tms.groups (group_name, username) VALUES (?, ?)",
      [group_name, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ message: "Inserted user into group" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//remove user from group => /group/removeUser
exports.removeUserFromGroup = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const username = req.body.username;
    const group_name = req.body.group_name;

    database.query(
      "DELETE FROM tms.groups WHERE group_name = ? AND username = ?",
      [group_name, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ message: "Removed user from group" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//get all groups that user in in => /group/user
exports.getUserGroups = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const username = decoded.username;
    database.query(
      "SELECT group_name FROM tms.groups WHERE username = ?",
      [username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ groups: results });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//get all groups that users are in => /groups
exports.getGroups = (req, res, next) => {
  database.query(
    "SELECT * FROM tms.groups ORDER BY username",
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({ groups: results });
      }
    }
  );
};
