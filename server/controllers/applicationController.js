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

function validateAcronym(res, acronym) {
  const regex = "^[a-zA-Z0-9]+$";
  let error = false;
  if (acronym.length < 3 || acronym.length > 20) {
    res.write("AcronymLength ");
    error = true;
  }
  if (!acronym.match(regex)) {
    res.write("AcronymCharacter ");
    error = true;
  }
  return error;
}

function validateDates(res, startDate, endDate) {
  const startArr = new Date(startDate);
  const endArr = new Date(endDate);
  if (startArr > endArr) {
    res.write("DatesInvalid ");
  }
  return startArr > endArr;
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
      create,
    } = req.body;
    if (name) {
      if (validateAcronym(res, name)) {
        res.send();
        return;
      }
      if (startDate && endDate && validateDates(res, startDate, endDate)) {
        res.send();
        return;
      }
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
            create,
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

exports.editApp = async (req, res, next) => {
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
      create,
    } = req.body;
    if (startDate && endDate && validateDates(res, startDate, endDate)) {
      res.send();
      return;
    }
    if (description) {
      database.query(
        "UPDATE application SET App_Description = ? WHERE App_Acronym = ?",
        [description, name]
      );
    }
    if (startDate || startDate === null) {
      database.query(
        "UPDATE application SET App_startDate = ? WHERE App_Acronym = ?",
        [startDate, name]
      );
    }
    if (endDate || endDate === null) {
      database.query(
        "UPDATE application SET App_endDate = ? WHERE App_Acronym = ?",
        [endDate, name]
      );
    }
    if (open) {
      database.query(
        "UPDATE application SET App_permit_Open = ? WHERE App_Acronym = ?",
        [open, name]
      );
    }
    if (todo) {
      database.query(
        "UPDATE application SET App_permit_todoList = ? WHERE App_Acronym = ?",
        [todo, name]
      );
    }
    if (doing) {
      database.query(
        "UPDATE application SET App_permit_Doing = ? WHERE App_Acronym = ?",
        [doing, name]
      );
    }
    if (done) {
      database.query(
        "UPDATE application SET App_permit_Done = ? WHERE App_Acronym = ?",
        [done, name]
      );
    }
    if (create) {
      database.query(
        "UPDATE application SET App_permit_Create = ? WHERE App_Acronym = ?",
        [create, name]
      );
    }
  } catch (err) {
    console.log(err);
  }
  res.end();
};

exports.getPermit = (req, res, next) => {
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
    const { app } = req.body;
    database.query(
      "SELECT * FROM application WHERE App_Acronym = ?",
      [app],
      function (err, results) {
        if (err) {
          console.log(err);
        } else if (results.length === 0) {
          res.send(false);
        } else {
          res.json(results);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
