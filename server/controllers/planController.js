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
  const name = req.body.name;
  database.query(
    "SELECT * FROM plan WHERE Plan_app_Acronym = ?",
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

exports.getPlanNames = (req, res, next) => {
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
    "SELECT Plan_MVP_name FROM plan WHERE Plan_app_Acronym = ?",
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

async function findPlan(name, appName) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM plan WHERE Plan_MVP_name = ? AND Plan_app_Acronym = ?",
      [name, appName],
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

function validatePlan(res, plan) {
  const regex = "^[a-zA-Z0-9]+$";
  let error = false;
  if (plan.length > 20) {
    res.write("PlanLength ");
    error = true;
  }
  if (!plan.match(regex)) {
    res.write("PlanCharacter ");
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

exports.createPlan = async (req, res, next) => {
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
    const { planName, startDate, endDate, name } = req.body;
    if (planName) {
      if (validatePlan(res, planName)) {
        res.send();
        return;
      }
      if (startDate && endDate && validateDates(res, startDate, endDate)) {
        res.send();
        return;
      }
      const planExists = await findPlan(planName, name);
      if (!planExists) {
        database.query(
          "INSERT INTO plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym) VALUES (?, ?, ?, ?)",
          [planName, startDate, endDate, name],
          function (err, results) {
            if (err) {
              console.log(err);
            } else {
              res.write("Success");
            }
          }
        );
      } else {
        res.write("PlanExists ");
      }
    } else {
      res.send(false);
    }
    res.end();
  } catch (err) {
    console.log(err);
  }
};

exports.editPlan = (req, res, next) => {
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
    const { name, planName, startDate, endDate } = req.body;
    if (startDate && endDate && validateDates(res, startDate, endDate)) {
      res.send();
      return;
    }
    database.query(
      "UPDATE plan SET Plan_startDate = ?, Plan_endDate = ? WHERE Plan_MVP_name = ? AND Plan_app_Acronym = ?",
      [startDate, endDate, planName, name],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.write("Success");
        }
      }
    );
    res.end();
  } catch (err) {
    console.log(err);
  }
};
