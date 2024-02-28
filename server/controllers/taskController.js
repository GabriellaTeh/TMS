const database = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { getDonePermit } = require("./applicationController");

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
    const { description, notes, task, state } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const time = new Date();
    const audit = `${username}, ${state}, ${time}: ${notes}`;
    database.query(
      "UPDATE task SET Task_description = ?, Task_notes = CONCAT_WS(CHAR(13), Task_notes, ?), Task_owner = ? WHERE task_id = ?",
      [description, audit, username, task],
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

exports.editTaskWithPlan = (req, res, next) => {
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
    const { description, plan, notes, task, state } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const time = new Date();
    if (plan && validatePlan(res, plan)) {
      res.send();
      return;
    }
    const audit = `${username}, ${state}, ${time}: ${notes}`;
    database.query(
      "UPDATE task SET Task_description = ?, Task_plan = ?, Task_notes = CONCAT_WS(CHAR(13), Task_notes, ?), Task_owner = ? WHERE task_id = ?",
      [description, plan, audit, username, task],
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

exports.editTaskWithPlanState = (req, res, next) => {
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
    const { description, plan, notes, task, state, newState } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const time = new Date();
    if (plan && validatePlan(res, plan)) {
      res.send();
      return;
    }
    const audit = `${username}, ${state}, ${time}: ${notes}`;
    database.query(
      "UPDATE task SET Task_description = ?, Task_plan = ?, Task_notes = CONCAT_WS(CHAR(13), Task_notes, ?), Task_owner = ?, Task_state = ? WHERE task_id = ?",
      [description, plan, audit, username, newState, task],
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

exports.editTaskWithState = (req, res, next) => {
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
    const { description, notes, task, state, newState } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const time = new Date();
    const audit = `${username}, ${state}, ${time}: ${notes}`;
    database.query(
      "UPDATE task SET Task_description = ?, Task_notes = CONCAT_WS(CHAR(13), Task_notes, ?), Task_owner = ?, Task_state = ? WHERE task_id = ?",
      [description, audit, username, newState, task],
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

exports.promoteDoingTask = (req, res, next) => {
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
    const { description, notes, plan, task, state, newState, app } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decoded.username;
    const time = new Date();
    const audit = `${username}, ${state}, ${time}: ${notes}`;
    if (plan && validatePlan(res, plan)) {
      res.send();
      return;
    }
    database.query(
      "UPDATE task SET Task_description = ?, Task_notes = CONCAT_WS(CHAR(13), Task_notes, ?), Task_owner = ?, Task_state = ?, Task_plan = ? WHERE task_id = ?",
      [description, audit, username, newState, plan, task],
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          sendEmail(app);
          res.write("Success");
        }
      }
    );
    res.end();
  } catch (err) {
    console.log(err);
  }
};

async function sendEmail(app, username) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const group = await getDonePermit(app);
  console.log(group);
  const sender = username;
  //get all emails in app_permit_done (do this in group controller) and send mail
  let emails = [];
}
