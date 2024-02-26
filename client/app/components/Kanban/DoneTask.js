import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import DispatchContext from "../../DispatchContext";

function DoneTask(props) {
  const navigate = useNavigate();
  const [description, setDescription] = useState(props.description);
  const [plan, setPlan] = useState(props.plan);
  const [notes, setNotes] = useState(props.notes);
  const appDispatch = useContext(DispatchContext);
  let { task } = useParams();
  const app = task.split("_")[0];

  function handlePlanChange(event, values) {
    setPlan(values);
  }

  async function handleSave() {
    try {
      const response = await Axios.post("/task/edit", {
        description,
        plan,
        notes,
        task,
      });
      console.log(response.data);
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
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate(`/kanban/${app}`);
  }

  return (
    <>
      <Grid container spacing={3} className="mt-1">
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Task Description</small>
            </label>

            <TextField
              fullWidth
              multiline
              rows={7}
              defaultValue={props.description}
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
              value={plan}
              options={props.plans}
              renderInput={(params) => (
                <TextField {...params} placeholder="No plans" />
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
              rows={6}
              defaultValue={props.notes}
              onChange={(e) => setNotes(e.target.value)}
            ></TextField>
          </div>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={handleCancel} color="error">
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default DoneTask;
