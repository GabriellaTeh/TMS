const database = require("../config/db");
const jwt = require("jsonwebtoken");

//returns true/false
async function checkGroup(username, group_name) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM tms.groups WHERE username = ? AND group_name = ?",
      [username, group_name],
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

//check if user is in group => /group/checkGroup
exports.checkGroup = async (req, res, next) => {
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
    const group_name = req.body.group_name;

    const result = await checkGroup(username, group_name);
    if (result) {
      res.status(200).json({ message: "User in group" });
    } else {
      res.json({ message: "User not in group" });
    }
  } catch (error) {
    console.log(error);
  }
};
