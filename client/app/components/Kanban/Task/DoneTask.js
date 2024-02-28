import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import dayjs from "dayjs";

function DoneTask(props) {
  const navigate = useNavigate();
  const [permitted, setPermitted] = useState(false);
  let { task } = useParams();
  const app = task.split("_")[0];

  function handleClose() {
    navigate(`/kanban/${app}`);
  }

  function handlePromote() {
    navigate(`/${task}/promote`);
  }

  function handleDemote() {
    navigate(`/${task}/demote`);
  }

  function handleEdit() {
    navigate(`/${task}/edit`);
  }

  async function checkDonePermit() {
    try {
      const response = await Axios.post("/app/permit", { app });
      const group_name = response.data[0].App_permit_Done;
      if (group_name) {
        try {
          const res = await Axios.post("/user/checkGroup", { group_name });
          setPermitted(res.data);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkDonePermit();
  }, []);

  return (
    <>
      <h4>
        Task #{task}: {props.taskName}
      </h4>
      Created by: {props.creator} <br></br> Created on:{" "}
      {dayjs(props.createDate).format("DD-MM-YYYY")}
      <br></br>Owner: {props.owner}
      <br></br> State: done
      {!permitted ? (
        <Grid container spacing={3} className="mt-1">
          <Grid item xs={6}>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Task Description</small>
              </label>
              <TextField
                fullWidth
                multiline
                InputProps={{ readOnly: true }}
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
                multiline
                InputProps={{ readOnly: true }}
                rows={6}
                defaultValue={props.notes}
              ></TextField>
            </div>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
      <div className="mt-3">
        {permitted ? (
          <>
            <Button onClick={handlePromote} variant="outlined" color="success">
              Promote
            </Button>{" "}
            <Button onClick={handleDemote} variant="outlined" color="warning">
              Demote
            </Button>{" "}
            <Button onClick={handleEdit} variant="outlined" color="primary">
              Edit
            </Button>{" "}
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default DoneTask;
