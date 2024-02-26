import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import dayjs from "dayjs";

function Task() {
  let { task } = useParams();
  const [taskName, setTaskName] = useState();
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState();
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [state, setState] = useState();
  const [creator, setCreator] = useState();
  const [owner, setOwner] = useState();
  const [createDate, setCreateDate] = useState();
  const navigate = useNavigate();

  async function getTaskDetails() {
    try {
      const response = await Axios.post("/task", { task });
      const data = response.data[0];
      setTaskName(data.Task_name);
      setDescription(data.Task_description);
      setNotes(data.Task_notes);
      setPlan(data.Task_plan);
      setState(data.Task_state);
      setCreator(data.Task_creator);
      setCreateDate(data.Task_createDate);
      setOwner(data.Task_owner);
      const name = data.Task_app_Acronym;
      try {
        const response = await Axios.post("/plan/list", { name });
        const list = [];
        response.data.forEach((plan) => {
          list.push(plan.Plan_MVP_name);
        });
        setPlans(list);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate(`/kanban/${task}`);
  }

  useEffect(() => {
    getTaskDetails();
  }, []);

  return (
    <>
      <div className="container md-5">
        <h4>
          Task #{task}: {taskName}
        </h4>
        Created by: {creator} <br></br> Created on:{" "}
        {dayjs(createDate).format("DD-MM-YYYY")}
        <br></br>Owner: {owner}
        <br></br> State: {state}
        <Grid container spacing={3} className="mt-1">
          <Grid item xs={6}>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Task Description</small>
              </label>
              {state === "closed" ? (
                <TextField
                  fullWidth
                  multiline
                  disabled
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
              )}
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Plan Name</small>
              </label>{" "}
              {state === "closed" ? (
                <Autocomplete
                  size="small"
                  readOnly
                  value={plan}
                  options={plans}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Plans" />
                  )}
                />
              ) : (
                <Autocomplete
                  size="small"
                  value={plan}
                  options={plans}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Plans" />
                  )}
                />
              )}
            </div>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Task Notes</small>
              </label>
              {state === "closed" ? (
                <TextField
                  fullWidth
                  disabled
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
              )}
            </div>
            <Button onClick={handleCancel} color="primary">
              {state === "closed" ? "Close" : "Cancel"}
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Task;
