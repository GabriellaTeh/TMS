const database = require("../config/db");
const jwt = require("jsonwebtoken");

exports.getTask = (req, res, next) => {
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
  const { task } = req.body;
  if (task) {
    try {
      database.query(
        "SELECT * FROM  task WHERE Task_id = ?",
        [task],
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
    }
  } else {
    res.send();
  }
};

exports.getTasks = (req, res, next) => {
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
  const { state, appName } = req.body;
  if (state) {
    try {
      database.query(
        "SELECT * from task WHERE Task_state = ? AND Task_app_Acronym = ? ",
        [state, appName],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            res.json(results);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send(false);
  }
};

async function findTask(task) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT * FROM task WHERE Task_id = ?",
      [task],
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

function validateTask(res, task) {
  const regex = "^[a-zA-Z0-9]+$";
  let error = false;
  if (task.length < 3 || task.length > 20) {
    res.write("TaskLength ");
    error = true;
  }
  if (!task.match(regex)) {
    res.write("TaskCharacter ");
    error = true;
  }
  return error;
}

async function getRNumber(appName) {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT App_Rnumber FROM application WHERE App_Acronym = ?",
      [appName],
      function (err, results) {
        if (err) {
          resolve(-1);
        }
        if (results.length === 0) {
          resolve(-1);
        } else {
          resolve(results[0].App_Rnumber);
        }
      }
    );
  });
}

exports.createTask = async (req, res, next) => {
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
  const { taskName, description, notes, plan, name, createDate } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const username = decoded.username;

  if (taskName) {
    if (validateTask(res, taskName)) {
      res.send();
      return;
    }
    if (plan && validatePlan(res, plan)) {
      res.send();
      return;
    }
    try {
      const rNumber = (await getRNumber(name)) + 1;
      const taskId = name + "_" + rNumber;
      const taskExists = await findTask(taskId);
      if (!taskExists) {
        database.query(
          "BEGIN; INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_creator, Task_owner, Task_createDate) VALUES (?,?,?,?,?,?,?,?,?); UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?; COMMIT",
          [
            taskName,
            description,
            notes,
            taskId,
            plan,
            name,
            username,
            username,
            createDate,
            rNumber,
            name,
          ],
          function (err, resuts) {
            if (err) {
              console.log(err);
            } else {
              res.write("Success");
            }
          }
        );
      } else {
        res.write("TaskExists ");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send(false);
  }
  res.end();
};

exports.editTask = (req, res, next) => {
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
    const { description, plan, notes, task } = req.body;
    if (plan && validatePlan(res, plan)) {
      res.send();
      return;
    }
    database.query(
      "UPDATE task SET Task_description = ?, Task_plan = ?, Task_notes = ? WHERE task_id = ?",
      [description, plan, notes, task],
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
