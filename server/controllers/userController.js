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

exports.verifyUser = (req, res, next) => {
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
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

//returns true/false
async function CheckGroup(userid, groupname) {
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
          if (match && active) {
            const token = jwt.sign(
              { username: username },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "3d",
              }
            );
            const isAdmin = await CheckGroup(username, "admin");
            res.status(200).json({
              token: token,
              username: username,
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
  let error = false;
  if (password.length < 8 || password.length > 10) {
    res.write("PasswordLength ");
    error = true;
  }
  if (!password.match(regex)) {
    res.write("PasswordCharacter ");
    error = true;
  }
  return error;
}

function validateEmail(res, email) {
  let error = false;
  if (email !== "") {
    if (!validator.isEmail(email)) {
      res.write("InvalidEmail ");
      error = true;
    }
  }
  return error;
}

function validateUsername(res, username) {
  const regex = "^[a-zA-Z0-9]+$";
  let error = false;
  if (username.length < 3 || username.length > 20) {
    res.write("UsernameLength ");
    error = true;
  }
  if (!username.match(regex)) {
    res.write("UsernameCharacter ");
    error = true;
  }
  return error;
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
      res.send();
      return;
    }
    if (validateEmail(res, email)) {
      res.send();
      return;
    }
    if (validatePassword(res, password)) {
      res.send();
      return;
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
            res.write("Success");
          }
        }
      );
    } else if (userExists) {
      res.write("UserExists ");
    } else if (emailExists) {
      res.write("EmailTaken ");
    }
  } else {
    res.send(false);
  }
  res.end();
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [username],
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
exports.updateEmail = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const email = req.body.email;

    if (email) {
      if (validateEmail(res, email)) {
        res.send();
        return;
      }
      let emailExists = false;
      if (email.length > 0) {
        emailExists = await findEmail(email);
      }
      if (!emailExists) {
        database.query(
          "UPDATE accounts SET email = ? WHERE username = ?",
          [email, username],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              if (results) {
                res.write("Success ");
              } else {
                res.send(false);
              }
            }
          }
        );
      } else {
        res.write("EmailTaken ");
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const password = req.body.password;

    if (password) {
      if (validatePassword(res, password)) {
        res.send();
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
              res.write("Success ");
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
  res.end();
};

//admin update password => /user/updatePasswordAdmin
exports.updatePasswordAdmin = async (req, res, next) => {
  const password = req.body.password;
  const username = req.body.username;
  if (password) {
    if (validatePassword(res, password)) {
      res.send();
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
            res.write("Success");
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
  res.end();
};

//admin update email => /user/updateEmailAdmin
exports.updateEmailAdmin = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;

  if (email) {
    if (validateEmail(res, email)) {
      res.send();
      return;
    }
  }
  let emailExists = false;
  if (email.length > 0) {
    emailExists = await findEmail(email);
  }
  if (!emailExists) {
    database.query(
      "UPDATE accounts SET email = ? WHERE username = ?",
      [email, username],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.write("Success ");
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.write("EmailTaken ");
  }
  res.end();
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
            res.write("Success ");
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
  res.end();
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
            res.write("Success ");
          } else {
            res.send(false);
          }
        }
      }
    );
  } else {
    res.send(false);
  }
  res.end();
};
