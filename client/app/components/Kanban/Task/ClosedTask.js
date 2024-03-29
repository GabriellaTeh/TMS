import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import dayjs from "dayjs";

function ClosedTask(props) {
  const navigate = useNavigate();
  let { task } = useParams();
  const app = task.split("_")[0];

  function handleCancel() {
    navigate(`/kanban/${app}`);
  }

  return (
    <>
      <Grid container spacing={3} className="mt-1">
        <Grid item xs={6}>
          <h4>
            Task #{task}: {props.taskName}
          </h4>
          Created by: {props.creator} <br></br> Created on:{" "}
          {dayjs(props.createDate).format("DD-MM-YYYY")}
          <br></br>Owner: {props.owner}
          <br></br> State: closed
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Plan Name</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              value={props.plan}
              options={props.plans}
              renderInput={(params) => (
                <TextField {...params} placeholder="No plans" />
              )}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Description</small>
            </label>
            <TextField
              fullWidth
              InputProps={{ readOnly: true }}
              multiline
              rows={7}
              defaultValue={props.description}
            ></TextField>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Notes</small>
            </label>
            <TextField
              fullWidth
              InputProps={{ readOnly: true }}
              multiline
              rows={6}
              defaultValue={props.notes}
            ></TextField>
          </div>
          <Button onClick={handleCancel} color="error">
            Close
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ClosedTask;
