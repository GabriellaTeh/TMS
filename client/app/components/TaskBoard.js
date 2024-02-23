import React, { useEffect, useState } from "react";
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

function TaskBoard() {
  const [openViewTask, setOpenViewTask] = useState(false);
  const [openTasks, setOpenTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);

  async function getOpenTasks() {
    try {
      const state = "open";
      const response = await Axios.post("/tasks", { state });
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

  function handleClose() {
    setOpenViewTask(false);
  }

  function handleViewTask() {
    setOpenViewTask(true);
  }

  useEffect(() => {
    getOpenTasks();
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
                        style={{ backgroundColor: "pink" }}
                      >
                        <CardContent>
                          <button
                            className="task-button"
                            onClick={handleViewTask}
                          >
                            <u>
                              {open.Task_name} ({open.Task_id})
                            </u>
                          </button>
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
              <TableBody></TableBody>
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
              <TableBody></TableBody>
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
              <TableBody></TableBody>
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
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskBoard;
