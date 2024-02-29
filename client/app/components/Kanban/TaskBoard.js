import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import Axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Tooltip } from "@mui/material";

function TaskBoard(props) {
  const [openTasks, setOpenTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const appName = props.appName;

  async function getOpenTasks() {
    try {
      const state = "open";
      const response = await Axios.post("/tasks", { state, appName });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        setOpenTasks(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getTodoTasks() {
    try {
      const state = "todo";
      const response = await Axios.post("/tasks", { state, appName });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        setTodoTasks(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getDoingTasks() {
    try {
      const state = "doing";
      const response = await Axios.post("/tasks", { state, appName });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        setDoingTasks(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getDoneTasks() {
    try {
      const state = "done";
      const response = await Axios.post("/tasks", { state, appName });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        setDoneTasks(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getClosedTasks() {
    try {
      const state = "closed";
      const response = await Axios.post("/tasks", { state, appName });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        setClosedTasks(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getOpenTasks();
    getTodoTasks();
    getDoingTasks();
    getDoneTasks();
    getClosedTasks();
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={2.4}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Open</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openTasks.map((open) => (
                  <TableRow>
                    <TableCell align="center">
                      <Card
                        variant="outlined"
                        style={{ backgroundColor: "#FFE4E1" }}
                      >
                        <CardContent>
                          <Tooltip title="View Task" arrow>
                            Task:{" "}
                            <Link to={`/${open.Task_id}`}>
                              {open.Task_name} ({open.Task_id})
                            </Link>
                          </Tooltip>
                          <br></br>
                          Plan: {open.Task_plan}
                          <br></br>
                          Owner: {open.Task_owner}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2.4}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Todo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todoTasks.map((todo) => (
                  <TableRow>
                    <TableCell align="center">
                      <Card
                        variant="outlined"
                        style={{ backgroundColor: "#FFF8DC" }}
                      >
                        <CardContent>
                          <Tooltip title="View Task" arrow>
                            Task:{" "}
                            <Link to={`/${todo.Task_id}`}>
                              {todo.Task_name} ({todo.Task_id})
                            </Link>
                          </Tooltip>
                          <br></br>
                          Plan: {todo.Task_plan}
                          <br></br>
                          Owner: {todo.Task_owner}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2.4}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Doing</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doingTasks.map((doing) => (
                  <TableRow>
                    <TableCell align="center">
                      <Card
                        variant="outlined"
                        style={{ backgroundColor: "#CFEAD3" }}
                      >
                        <CardContent>
                          <Tooltip title="View Task" arrow>
                            Task:{" "}
                            <Link to={`/${doing.Task_id}`}>
                              {doing.Task_name} ({doing.Task_id})
                            </Link>
                          </Tooltip>
                          <br></br>
                          Plan: {doing.Task_plan}
                          <br></br>
                          Owner: {doing.Task_owner}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2.4}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Done</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doneTasks.map((done) => (
                  <TableRow>
                    <TableCell align="center">
                      <Card
                        variant="outlined"
                        style={{ backgroundColor: "#FFDAB9" }}
                      >
                        <CardContent>
                          <Tooltip title="View Task" arrow>
                            Task:{" "}
                            <Link to={`/${done.Task_id}`}>
                              {done.Task_name} ({done.Task_id})
                            </Link>
                          </Tooltip>
                          <br></br>
                          Plan: {done.Task_plan}
                          <br></br>
                          Owner: {done.Task_owner}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={2.4}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Closed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {closedTasks.map((closed) => (
                  <TableRow>
                    <TableCell align="center">
                      <Card
                        variant="outlined"
                        style={{ backgroundColor: "#D3D3D3" }}
                      >
                        <CardContent>
                          <Tooltip title="View Task" arrow>
                            Task:{" "}
                            <Link to={`/${closed.Task_id}`}>
                              {closed.Task_name} ({closed.Task_id})
                            </Link>
                          </Tooltip>
                          <br></br>
                          Plan: {closed.Task_plan}
                          <br></br>
                          Owner: {closed.Task_owner}
                        </CardContent>
                      </Card>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskBoard;
