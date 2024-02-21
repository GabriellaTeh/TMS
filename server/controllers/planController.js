const database = require("../config/db");

exports.getPlans = (req, res, next) => {
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
  database.query("SELECT * FROM plan", function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};
