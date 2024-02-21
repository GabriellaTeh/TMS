import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Axios from "axios";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function CreateApp() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState("");
  const [todo, setTodo] = useState("");
  const [doing, setDoing] = useState("");
  const [done, setDone] = useState("");
  const [create, setCreate] = useState("");
  const [groupList, setGroupList] = useState([]);
  const navigate = useNavigate();

  function handleOpenChange(event, values) {
    setOpen(values);
  }

  function handleTodoChange(event, values) {
    setTodo(values);
  }

  function handleDoingChange(event, values) {
    setDoing(values);
  }

  function handleDoneChange(event, values) {
    setDone(values);
  }

  function handleCreateChange(event, values) {
    setCreate(values);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (name) {
      const response = await Axios.post("/app/create", {
        name,
        description,
        startDate,
        endDate,
        open,
        todo,
        doing,
        done,
        create,
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
          if (data.includes("AppExists")) {
            appDispatch({
              type: "errorMessage",
              value: "Application Acronym exists.",
            });
          }
          if (data.includes("AcronymLength")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Application acronym must be at least 3 and at most 20 characters long.",
            });
          }
          if (data.includes("AcronymCharacter")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Application acronym can only contain alphanumeric characters.",
            });
          }
          if (data.includes("DatesInvalid")) {
            appDispatch({
              type: "errorMessage",
              value: "Start date must be before or equal to end date.",
            });
          }
        } else {
          appDispatch({
            type: "successMessage",
            value: "Application created.",
          });
          navigate("/home");
        }
      }
    } else {
      appDispatch({
        type: "errorMessage",
        value: "Application acronym required.",
      });
    }
  }

  function handleCancel() {
    navigate("/home");
  }

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      if (!response.data) {
        navigate("/home");
      } else {
        getGroupList();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getGroupList() {
    setGroupList([]);
    try {
      const response = await Axios.get("/groups");
      if (response.data) {
        const options = [];
        response.data.forEach((group) => {
          options.push(group.name);
        });
        setGroupList(options);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    } else {
      checkPL();
    }
  }, []);

  return (
    <div className="container md-5">
      <Helmet>
        <title>Create App</title>
      </Helmet>
      <h4>Create Application</h4>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Application Acronym</small>
            </label>
            <TextField
              fullWidth
              size="small"
              label="Acronym"
              onChange={(e) => setName(e.target.value)}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Application Description</small>
            </label>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={8}
              onChange={(e) => setDescription(e.target.value)}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Start Date</small>
            </label>
            {"  "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="Start date"
                format="DD-MM-YYYY"
                onChange={(newValue) => {
                  setStartDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>End Date </small>
            </label>
            {"  "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="End date"
                format="DD-MM-YYYY"
                onChange={(newValue) => {
                  setEndDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
            </LocalizationProvider>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Create</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit create" />
              )}
              onChange={handleCreateChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Open</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleOpenChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Todo</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit todo" />
              )}
              onChange={handleTodoChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Doing</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit doing" />
              )}
              onChange={handleDoingChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Done</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit done" />
              )}
              onChange={handleDoneChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-sm btn-success"
          >
            Create Application
          </button>{" "}
          <button
            onClick={handleCancel}
            type="submit"
            className="btn btn-sm btn-secondary"
          >
            Cancel
          </button>
        </Grid>
      </Grid>
    </div>
  );
}

export default CreateApp;
