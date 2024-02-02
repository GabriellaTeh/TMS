const database = require("../config/db");
const jwt = require("jsonwebtoken");

//returns true/false
async function CheckGroup(userid, groupname) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM tms.groups WHERE id = ? AND group_name = ?",
      [userid, groupname],
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

exports.checkUserGroup = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.send(false);
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, "my_secret_key");
      const userid = decoded.id;
      const group_name = req.body.group_name;
      const result = await CheckGroup(userid, group_name);
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  }
};

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
    return res.send(false);
  }
  try {
    const userId = req.body.id;
    const group_name = req.body.group_name;

    database.query(
      "INSERT INTO tms.groups (group_name, id) VALUES (?, ?)",
      [group_name, userId],
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
    res.send(false);
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
    return res.send(false);
  }
  try {
    const userId = req.body.id;
    const group_name = req.body.group_name;

    database.query(
      "DELETE FROM tms.groups WHERE group_name = ? AND id = ?",
      [group_name, userId],
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
    res.send(false);
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
    return res.send(false);
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const userId = decoded.id;
    database.query(
      "SELECT group_name FROM tms.groups WHERE id = ?",
      [userId],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.send(false);
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
