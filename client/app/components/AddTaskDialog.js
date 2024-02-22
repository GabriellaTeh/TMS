import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";

function AddTaskDialog() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Name</small>
            </label>{" "}
            <TextField size="small" label="Task name"></TextField>
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
            ></TextField>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Plan Name</small>
            </label>{" "}
            <TextField size="small" label="Plan Name"></TextField>
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
            ></TextField>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default AddTaskDialog;
