const database = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create default admin => /
exports.createAdmin = async (req, res, next) => {
  const username = "admin";
  const password = "admin"; //TODO: change to match password validation
  const email = "admin@gmail.com";
  const group_name = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);
  database.query(
    "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?); INSERT INTO tms.groups (group_name, username) VALUES (?, ?)",
    [username, hashedPassword, email, group_name, username],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.json({ message: "Create admin successful" });
      }
    }
  );
};

// login user => /user/login
exports.loginUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    database.query(
      "SELECT * FROM accounts WHERE username = ?",
      [username],
      async function (error, results) {
        if (error) {
          console.log(error);
        } else if (results.length > 0) {
          const match = await bcrypt.compare(password, results[0].password);
          const active = results[0].isActive === 1;
          if (match && active) {
            const token = jwt.sign({ username: username }, "my_secret_key", {
              expiresIn: "3d",
            });
            res.status(200).json({ message: "Login successful", token });
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

//admin creates new user => /user/createUser
exports.createUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username && password && email) {
    //TODO: password, username, email validation

    const hashedPassword = await bcrypt.hash(password, 10);
    database.query(
      "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email],
      function (error, results) {
        if (error) {
          console.log(error);
        } else {
          res.json({ message: "Create user successful" });
        }
      }
    );
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
    res.send(false);
    return;
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const username = decoded.username;
    database.query(
      "SELECT isActive FROM accounts WHERE username = ?",
      [username],
      function (err, results) {
        if (err) {
          console.log(err);
          return;
        }
        if (results[0]) {
          res.status(200).json({ message: "View profile success" });
        } else {
          res.send(false);
        }
      }
    );
  } catch (err) {
    console.log(err);
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
    res.send(false);
    return;
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const username = decoded.username;
    const email = req.body.email;

    if (email) {
      database.query(
        "UPDATE accounts SET email = ? WHERE username = ?",
        [email, username],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results) {
              res.status(200).json({ message: "Email updated" });
            }
          }
        }
      );
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
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
    res.send(false);
    return;
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const username = decoded.username;
    const password = req.body.password;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      database.query(
        "UPDATE accounts SET password = ? WHERE username = ?",
        [hashedPassword, username],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results) {
              res.status(200).json({ message: "Password updated" });
            }
          }
        }
      );
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
  }
};

//admin update password => /user/updatePasswordAdmin
exports.updatePasswordAdmin = async (req, res, next) => {
  const password = req.body.password;

  if (password) {
    const hashedPassword = await bcrypt(password, 10);
    database.query(
      "UPDATE accounts SET password = ? WHERE username = ?",
      [hashedPassword],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "Password updated by admin" });
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

  if (email) {
    database.query(
      "UPDATE accounts SET email = ? WHERE username = ?",
      [email],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "Email updated by admin" });
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

  if (isActive) {
    database.query(
      "UPDATE accounts SET isActive = ? WHERE username = ?",
      [isActive],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "isActive updated by admin" });
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

  if (isActive) {
    database.query(
      "UPDATE accounts SET isActive = ? WHERE username = ?",
      [isActive],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          if (results) {
            res.status(200).json({ message: "isActive updated by admin" });
          }
        }
      }
    );
  } else {
    res.send(false);
  }
};
