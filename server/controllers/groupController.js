const database = require("../config/db");
const jwt = require("jsonwebtoken");

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
async function CheckGroup(userid, groupname) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM accounts WHERE id = ?",
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

function validateGroup(res, group_name) {
  const regex = "^[a-zA-Z0-9]+$";
  if (group_name.length < 3 || group_name.length > 20) {
    return res.send("Group Length");
  }
  if (!group_name.match(regex)) {
    return res.send("Group Character");
  }
}

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
    if (validateGroup(res, group_name)) {
      return;
    }
    const validatedGroup = group_name + ",";

    database.query(
      "UPDATE accounts SET groupNames = CONCAT(groupNames, ?) WHERE id = ?",
      [validatedGroup, userId],
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
    const userId = req.body.id;
    const group_name = req.body.group_name;
    database.query(
      "SELECT * FROM accounts where id = ?",
      [userId],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          const groups = results[0].groupNames.split(",");
          groups.pop();
          const index = groups.indexOf(group_name);
          groups.splice(index, 1);
          let newGroup;
          if (groups.length > 0) {
            newGroup = groups.join() + ",";
          } else {
            newGroup = "";
          }
          database.query(
            "UPDATE accounts SET groupNames = ? WHERE id = ?",
            [newGroup, userId],
            function (err, results) {
              if (err) {
                console.log(err);
              } else {
                res.status(200).json({ message: "Removed user from group" });
              }
            }
          );
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
    const userId = req.body.id;
    database.query(
      "SELECT groupNames FROM accounts WHERE id = ?",
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
