import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete, Button } from "@mui/material";
import DispatchContext from "../../../DispatchContext";
import dayjs from "dayjs";

function DoneTaskContent(props) {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState();
  const [creator, setCreator] = useState();
  const [owner, setOwner] = useState();
  const [createDate, setCreateDate] = useState();
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [taskName, setTaskName] = useState();
  const [permitted, setPermitted] = useState(false);
  const appDispatch = useContext(DispatchContext);
  let { task, action } = useParams();
  const app = task.split("_")[0];

  async function handleSave() {
    try {
      if (notes === props.notes) {
        appDispatch({
          type: "errorMessage",
          value: "Please add notes to update.",
        });
      } else {
        const response = await Axios.post("/task/edit", {
          description,
          notes,
          task,
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
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSavePromote() {
    try {
      if (notes === props.notes) {
        appDispatch({
          type: "errorMessage",
          value: "Please add notes to update.",
        });
      } else {
        const response = await Axios.post("/task/edit", {
          description,
          notes,
          task,
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
            try {
              const state = "closed";
              const response = await Axios.post("/task/editState", {
                state,
                task,
              });
              if (response.data === "Jwt") {
                appDispatch({ type: "errorMessage", value: "Token invalid." });
                appDispatch({ type: "logout" });
                navigate("/");
              } else if (response.data === "Inactive") {
                navigate("/");
                appDispatch({ type: "errorMessage", value: "Inactive." });
              } else if (response.data) {
                appDispatch({
                  type: "successMessage",
                  value: "Task promoted.",
                });
                navigate(`/kanban/${app}`);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSaveDemote() {
    try {
      if (notes === props.notes) {
        appDispatch({
          type: "errorMessage",
          value: "Please add notes to update.",
        });
      } else {
        const response = await Axios.post("/task/edit", {
          description,
          notes,
          task,
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
            try {
              const state = "doing";
              const response = await Axios.post("/task/editState", {
                state,
                task,
              });
              if (response.data === "Jwt") {
                appDispatch({ type: "errorMessage", value: "Token invalid." });
                appDispatch({ type: "logout" });
                navigate("/");
              } else if (response.data === "Inactive") {
                navigate("/");
                appDispatch({ type: "errorMessage", value: "Inactive." });
              } else if (response.data) {
                appDispatch({
                  type: "successMessage",
                  value: "Task demoted.",
                });
                navigate(`/kanban/${app}`);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate(`/kanban/${app}`);
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

  async function getTaskDetails() {
    try {
      const response = await Axios.post("/task", { task });
      const data = response.data[0];
      setTaskName(data.Task_name);
      setDescription(data.Task_description);
      setNotes(data.Task_notes);
      setPlan(data.Task_plan);
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

  useEffect(() => {
    checkDonePermit();
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
        <br></br> State: done
        <Grid container spacing={3} className="mt-1">
          <Grid item xs={6}>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Task Description</small>
              </label>
              {permitted ? (
                <TextField
                  fullWidth
                  multiline
                  rows={7}
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></TextField>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  InputProps={{ readOnly: true }}
                  rows={7}
                  defaultValue={description}
                ></TextField>
              )}
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
                value={plan}
                options={plans}
                renderInput={(params) => (
                  <TextField {...params} placeholder="No plans" />
                )}
              />
            </div>
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Task Notes</small>
              </label>
              {permitted ? (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  defaultValue={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></TextField>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  InputProps={{ readOnly: true }}
                  rows={6}
                  defaultValue={notes}
                ></TextField>
              )}
            </div>
            <>
              {action === "promote" ? (
                <Button onClick={handleSavePromote} color="success">
                  Save and Promote
                </Button>
              ) : action === "demote" ? (
                <Button onClick={handleSaveDemote} color="success">
                  Save and Demote
                </Button>
              ) : (
                <Button onClick={handleSave} color="success">
                  Save
                </Button>
              )}
              <Button onClick={handleCancel} color="error">
                Cancel
              </Button>
            </>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default DoneTaskContent;
