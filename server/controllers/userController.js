const database = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//create default admin => /createAdmin
exports.createAdmin = async (req, res, next) => {
  const username = "admin";
  const password = "admin123!";
  const email = "admin@gmail.com";
  const group = "admin,";
  const group_name = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);
  database.query(
    "INSERT INTO accounts (username, password, email, groupNames) VALUES (?, ?, ?, ?); INSERT INTO tms.groups (name) VALUES (?)",
    [username, hashedPassword, email, group, group_name],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.json({ message: "Create admin successful" });
      }
    }
  );
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
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

// login user => /user/login
exports.loginUser = async (req, res, next) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  if (username && password) {
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [username],
      async function (error, results) {
        if (error) {
          console.log(error);
        } else if (results.length === 0) {
          res.send(false);
        } else {
          const match = await bcrypt.compare(password, results[0].password);
          const active = results[0].isActive === 1;
          const userid = results[0].id;
          if (match && active) {
            const token = jwt.sign({ id: userid }, "my_secret_key", {
              expiresIn: "3d",
            });
            const isAdmin = await CheckGroup(userid, "admin");
            res.status(200).json({
              token: token,
              username: username,
              id: userid,
              admin: isAdmin,
            });
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
    res.end();
  }
};

function validatePassword(res, password) {
  const regex = "^(?=.*[0-9])(?=.*[!@#$%^?/&*])[a-zA-Z0-9!@#$%^?/&*]";
  if (password.length < 8 || password.length > 10) {
    return res.send("Password Length");
  }
  if (!password.match(regex)) {
    return res.send("Password Character");
  }
}
function validateEmail(res, email) {
  if (email === "") {
    return;
  }
  if (!validator.isEmail(email)) {
    return res.send("Invalid Email");
  }
}

function validateUsername(res, username) {
  const regex = "^[a-zA-Z0-9]+$";
  if (username.length < 3 || username.length > 20) {
    return res.send("Username Length");
  }
  if (!username.match(regex)) {
    return res.send("Username Character");
  }
}

function validateGroup(res, group_name) {
  const regex = "^[a-zA-Z0-9]+$";
  if (group_name.length < 3 || group_name.length > 20) {
    return res.send("Group Length");
  }
  if (!group_name.match(regex)) {
    return res.send("Group Character");
  }
}

async function findUser(username) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [username],
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

async function findEmail(email) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM accounts WHERE email = ?",
      [email],
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

//admin creates new user => /user/createUser
exports.createUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const groups = req.body.groupNames;

  if (username && password) {
    if (validateUsername(res, username)) {
      return;
    }
    if (validateEmail(res, email)) {
      return;
    }
    if (validatePassword(res, password)) {
      return;
    }
    for (let i = 0; i < groups.length; i++) {
      if (validateGroup(res, groups[i])) {
        return;
      }
    }
    let groupList;
    if (groups.length > 0) {
      groupList = groups.join() + ",";
    } else {
      groupList = "";
    }
    const usernameLower = username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExists = await findUser(usernameLower);
    let emailExists = false;
    if (email.length > 0) {
      emailExists = await findEmail(email);
    }
    if (!userExists && !emailExists) {
      database.query(
        "INSERT INTO accounts (username, password, email, groupNames) VALUES (?, ?, ?, ?)",
        [usernameLower, hashedPassword, email, groupList],
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            res.json({ message: "Create user successful" });
          }
        }
      );
    } else if (userExists) {
      res.send("User exists");
    } else if (emailExists) {
      res.send("Email taken");
    }
  } else {
    res.send(false);
  }
};

//get all users => /users
exports.viewUsers = (req, res, next) => {
  database.query("SELECT * FROM accounts", function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};

//view profile => /user/profile
exports.viewProfile = (req, res, next) => {
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
      "SELECT * FROM accounts WHERE id = ?",
      [userId],
      function (err, results) {
        if (err) {
          console.log(err);
          return;
        }
        if (results) {
          res.status(200).json({
            token: token,
            username: results[0].username,
            email: results[0].email,
            message: "View profile success",
          });
        } else {
          res.send(false);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.send(false);
  }
};

//update email => /user/updateEmail
exports.updateEmail = (req, res, next) => {
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
    const email = req.body.email;

    if (email) {
      if (validateEmail(res, email)) {
        return;
      }
      database.query(
        "UPDATE accounts SET email = ? WHERE id = ?",
        [email, userId],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results) {
              res.status(200).json({ token: token, message: "Email updated" });
            } else {
              res.send(false);
            }
          }
        }
      );
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send(false);
  }
};

//update password => /user/updatePassword
exports.updatePassword = async (req, res, next) => {
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
    const password = req.body.password;

    if (password) {
      if (validatePassword(res, password)) {
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      database.query(
        "UPDATE accounts SET password = ? WHERE id = ?",
        [hashedPassword, userId],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results) {
              res
                .status(200)
                .json({ token: token, message: "Password updated" });
            } else {
              res.send(false);
            }
          }
        }
      );
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send(false);
  }
};

//admin update password => /user/updatePasswordAdmin
exports.updatePasswordAdmin = async (req, res, next) => {
  const password = req.body.password;
  const username = req.body.username;
  if (password) {
    if (validatePassword(res, password)) {
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    database.query(
      "UPDATE accounts SET password = ? WHERE username = ?",
      [hashedPassword, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "Password updated by admin" });
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
};

//admin update email => /user/updateEmailAdmin
exports.updateEmailAdmin = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;

  if (email) {
    if (validateEmail(res, email)) {
      return;
    }
    database.query(
      "UPDATE accounts SET email = ? WHERE username = ?",
      [email, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "Email updated by admin" });
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
};

//admin update isActive to false => /user/disableUser
exports.disableUser = (req, res, next) => {
  const isActive = false;
  const username = req.body.username;

  if (username) {
    database.query(
      "UPDATE accounts SET isActive = ? WHERE username = ?",
      [isActive, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "isActive updated by admin" });
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
};

//admin update isActive to true => /user/activateUser
exports.activateUser = (req, res, next) => {
  const isActive = true;
  const username = req.body.username;

  if (username) {
    database.query(
      "UPDATE accounts SET isActive = ? WHERE username = ?",
      [isActive, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "isActive updated by admin" });
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
};
