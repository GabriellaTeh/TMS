import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import Axios from "axios";
import dayjs from "dayjs";
import DispatchContext from "../../DispatchContext";

function AddTaskDialog(props) {
  const [taskName, setTaskName] = useState();
  const [description, setDescription] = useState();
  const [plan, setPlan] = useState("");
  const [notes, setNotes] = useState();
  const appDispatch = useContext(DispatchContext);
  let { name } = useParams();

  function handlePlanChange(event, values) {
    setPlan(values);
  }

  async function handleSaveTask() {
    if (taskName) {
      try {
        const createDate = dayjs().format("YYYY-MM-DD");
        const response = await Axios.post("/task/create", {
          taskName,
          description,
          notes,
          plan,
          name,
          createDate,
        });
        if (response.data === "Jwt") {
          appDispatch({ type: "errorMessage", value: "Token invalid." });
          appDispatch({ type: "logout" });
          navigate("/");
        } else if (response.data === "Inactive") {
          navigate("/");
          appDispatch({ type: "errorMessage", value: "Inactive." });
        } else {
          const data = response.data.split(" ");
          data.pop();
          if (data.length > 0) {
            if (data.includes("TaskExists")) {
              appDispatch({
                type: "errorMessage",
                value: "Task name taken.",
              });
            }
            if (data.includes("TaskLength")) {
              appDispatch({
                type: "errorMessage",
                value:
                  "Task name must be at least 3 and at most 20 characters long.",
              });
            }
            if (data.includes("TaskCharacter")) {
              appDispatch({
                type: "errorMessage",
                value: "Task name can only contain alphanumeric characters.",
              });
            }
            if (data.includes("PlanLength")) {
              appDispatch({
                type: "errorMessage",
                value: "Plan name must be at most 20 characters long.",
              });
            }
            if (data.includes("PlanCharacter")) {
              appDispatch({
                type: "errorMessage",
                value: "Plan name can only contain alphanumeric characters.",
              });
            }
          } else {
            appDispatch({ type: "successMessage", value: "Task created." });
            props.setOpenAddTask(false);
            window.location.reload();
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      appDispatch({ type: "errorMessage", value: "Task name required." });
    }
  }

  function handleCancelTask() {
    props.setOpenAddTask(false);
    window.location.reload();
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Name</small>
            </label>{" "}
            <TextField
              size="small"
              label="Task name"
              onChange={(e) => setTaskName(e.target.value)}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Description</small>
            </label>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Task description"
              onChange={(e) => setDescription(e.target.value)}
            ></TextField>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Plan Name</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={props.plans}
              renderInput={(params) => (
                <TextField {...params} placeholder="Plans" />
              )}
              onChange={handlePlanChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Notes</small>
            </label>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Task notes"
              onChange={(e) => setNotes(e.target.value)}
            ></TextField>
          </div>
          <Button onClick={handleSaveTask} color="success">
            Create Task
          </Button>
          <Button onClick={handleCancelTask} color="primary">
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default AddTaskDialog;
