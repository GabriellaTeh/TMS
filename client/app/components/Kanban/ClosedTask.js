import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import dayjs from "dayjs";

function ClosedTask(props) {
  const navigate = useNavigate();
  let { task } = useParams();

  function handleCancel() {
    navigate(`/kanban/${task}`);
  }

  return (
    <>
      <Grid container spacing={3} className="mt-1">
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Description</small>
            </label>
            {/* {state === "closed" ? (
              <TextField
                fullWidth
                InputProps={{ readOnly: true }}
                multiline
                rows={7}
                defaultValue={description}
              ></TextField>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={7}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              ></TextField>
            )} */}
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
              <small>Plan Name</small>
            </label>{" "}
            {/* {state === "closed" ? (
              <Autocomplete
                size="small"
                readOnly
                value={plan}
                options={plans}
                renderInput={(params) => (
                  <TextField {...params} placeholder="No plans" />
                )}
              />
            ) : (
              <Autocomplete
                size="small"
                value={plan}
                options={plans}
                renderInput={(params) => (
                  <TextField {...params} placeholder="No plans" />
                )}
              />
            )} */}
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
              <small>Task Notes</small>
            </label>
            <TextField
              fullWidth
              InputProps={{ readOnly: true }}
              multiline
              rows={6}
              defaultValue={props.notes}
            ></TextField>
            {/* {state === "closed" ? (
              <TextField
                fullWidth
                InputProps={{ readOnly: true }}
                multiline
                rows={6}
                defaultValue={notes}
              ></TextField>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={6}
                defaultValue={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></TextField>
            )} */}
          </div>
          <Button onClick={handleCancel} color="primary">
            Close
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ClosedTask;
