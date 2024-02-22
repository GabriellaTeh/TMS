import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";

function AddTaskDialog(props) {
  const [taskName, setTaskName] = useState();
  const [description, setDescription] = useState();
  const [plan, setPlan] = useState("");
  const [notes, setNotes] = useState();

  //TODO: when create task, do 2-phase commit
  //taskName, description, notes, plan, appName, state (open), creator (current user), owner (current user), createDate (current date)

  function handlePlanChange(event, values) {
    setPlan(values);
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
        </Grid>
      </Grid>
      <Button variant="contained" color="success">
        Save
      </Button>{" "}
      <Button variant="contained" color="error">
        Cancel
      </Button>
    </>
  );
}

export default AddTaskDialog;
