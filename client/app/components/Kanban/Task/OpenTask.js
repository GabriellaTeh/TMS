import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import dayjs from "dayjs";
import DispatchContext from "../../../DispatchContext";

function OpenTask(props) {
  const navigate = useNavigate();
  const [description, setDescription] = useState(props.description);
  const [plan, setPlan] = useState(props.plan);
  const [notes, setNotes] = useState(props.notes);
  const [permitted, setPermitted] = useState(false);
  const state = props.state;
  const appDispatch = useContext(DispatchContext);
  let { task } = useParams();
  const app = task.split("_")[0];

  function handlePlanChange(event, values) {
    setPlan(values);
  }

  async function handleSave() {
    try {
      if (notes && notes !== props.notes) {
        const response = await Axios.post("/task/editWithPlan", {
          description,
          plan,
          notes,
          task,
          state,
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
            appDispatch({ type: "successMessage", value: "Task updated." });
            navigate(`/kanban/${app}`);
          }
        }
      } else {
        appDispatch({
          type: "errorMessage",
          value: "Enter notes to update task.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSavePromote() {
    try {
      if (notes && notes !== props.notes) {
        const newState = "todo";
        const response = await Axios.post("/task/editWithPlanState", {
          description,
          plan,
          notes,
          task,
          state,
          newState,
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
            appDispatch({
              type: "successMessage",
              value: "Task updated and promoted.",
            });
            navigate(`/kanban/${app}`);
          }
        }
      } else {
        appDispatch({
          type: "errorMessage",
          value: "Enter notes to update task.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate(`/kanban/${app}`);
  }

  async function checkOpenPermit() {
    try {
      const response = await Axios.post("/app/permit", { app });
      const group_name = response.data[0].App_permit_Open;
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
    checkOpenPermit();
  }, []);

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
          <br></br> State: {props.state}
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Plan Name</small>
            </label>{" "}
            {permitted ? (
              <Autocomplete
                size="small"
                value={plan}
                options={props.plans}
                renderInput={(params) => (
                  <TextField {...params} placeholder="No plans" />
                )}
                onChange={handlePlanChange}
              />
            ) : (
              <Autocomplete
                size="small"
                readOnly
                value={plan}
                options={props.plans}
                renderInput={(params) => (
                  <TextField {...params} placeholder="No plans" />
                )}
              />
            )}
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Description</small>
            </label>
            {permitted ? (
              <TextField
                fullWidth
                multiline
                rows={7}
                defaultValue={props.description}
                onChange={(e) => setDescription(e.target.value)}
              ></TextField>
            ) : (
              <TextField
                fullWidth
                multiline
                InputProps={{ readOnly: true }}
                rows={7}
                defaultValue={props.description}
              ></TextField>
            )}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Notes</small>
            </label>
            {permitted ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  InputProps={{ readOnly: true }}
                  rows={6}
                  defaultValue={props.notes}
                  placeholder="No existing notes"
                ></TextField>
                <label className="text-muted mb-1">
                  <small>Additional Notes</small>
                </label>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes"
                ></TextField>
              </>
            ) : (
              <TextField
                fullWidth
                multiline
                InputProps={{ readOnly: true }}
                rows={6}
                defaultValue={props.notes}
                placeholder="No notes"
              ></TextField>
            )}
          </div>
          {permitted ? (
            <>
              <Button onClick={handleSavePromote} color="success">
                Save and Promote
              </Button>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
            </>
          ) : (
            ""
          )}
          <Button onClick={handleCancel} color="error">
            Close
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default OpenTask;
