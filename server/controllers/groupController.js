const database = require("../config/db");
const jwt = require("jsonwebtoken");

function validateGroup(res, group_name) {
  const regex = "^[a-zA-Z0-9]+$";
  let error = false;
  if (group_name.length < 3 || group_name.length > 20) {
    res.write("GroupLength ");
    error = true;
  }
  if (!group_name.match(regex)) {
    res.write("GroupCharacter ");
    error = true;
  }
  return error;
}

exports.createGroup = async (req, res, next) => {
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
    const group_name = req.body.group;

    if (group_name) {
      if (validateGroup(res, group_name)) {
        res.send();
        return;
      }
      const groupExists = await findGroup(group_name);
      if (!groupExists) {
        database.query(
          "INSERT INTO tms.groups (name) VALUES (?)",
          [group_name],
          function (error, results) {
            if (error) {
              console.log(error);
            } else {
              res.write("Success");
            }
          }
        );
      } else {
        res.write("GroupExists ");
      }
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send(false);
  }
  res.end();
};

async function findGroup(group) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM tms.groups WHERE name = ?",
      [group],
      function (err, results) {
        if (err) {
          resolve(false);
        }
        if (results.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

//get all groups in db => /groups
exports.getGroups = (req, res, next) => {
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
    database.query("SELECT * FROM tms.groups", function (err, results) {
      if (err) {
        console.log(err);
      } else {
        res.json(results);
      }
    });
  } catch (err) {
    console.log(err);
    res.send(false);
  }
};

//returns true/false
async function Checkgroup(userid, groupname) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [userid],
      function (err, results) {
        if (err) {
          resolve(false);
        }
        if (results.length === 1) {
          const groups = results[0].groupNames.split(",");
          if (groups.includes(groupname)) {
            resolve(true);
          } else {
            resolve(false);
          }
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const username = decoded.username;
      const group_name = req.body.group_name;
      const result = await Checkgroup(username, group_name);
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
    const username = req.body.username;
    const group_name = req.body.group_name + ",";

    if (validateGroup(res, req.body.group_name)) {
      res.send();
      return;
    }

    database.query(
      "UPDATE accounts SET groupNames = CONCAT(groupNames, ?) WHERE username = ?",
      [group_name, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "Inserted user into group" });
          }
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
    const username = req.body.username;
    if (username !== "admin") {
      const empty = "";
      database.query(
        "UPDATE accounts SET groupNames = ? WHERE username = ?",
        [empty, username],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ message: "Removed user from group" });
          }
        }
      );
    } else {
      res.json({ message: "Group cannot be removed for default admin." });
    }
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
    const username = req.body.username;
    database.query(
      "SELECT groupNames FROM accounts WHERE username = ?",
      [username],
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
