const database = require("../config/db");

async function findApp(name) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM application WHERE App_Acronym = ?",
      [name],
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

exports.createApp = async (req, res, next) => {
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
    const {
      name,
      description,
      startDate,
      endDate,
      open,
      todo,
      doing,
      done,
      closed,
    } = req.body;
    if (name) {
      //add validation
      const appExists = await findApp(name);
      if (!appExists) {
        database.query(
          "INSERT INTO application (App_Acronym, App_Description, App_startDate, App_endDate, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_Create) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            description,
            startDate,
            endDate,
            open,
            todo,
            doing,
            done,
            closed,
          ],
          function (err, results) {
            if (err) {
              console.log(err);
              res.write("Fail");
            } else {
              res.write("Success ");
            }
          }
        );
      } else {
        res.write("AppExists ");
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

exports.getApps = (req, res, next) => {
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
  database.query("SELECT * FROM application", function (error, results) {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};

exports.getApp = (req, res, next) => {
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
  const name = req.body.name;
  database.query(
    "SELECT * FROM application WHERE App_Acronym = ?",
    [name],
    function (error, results) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
