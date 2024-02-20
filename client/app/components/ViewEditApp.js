import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function ViewEditApp() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [isPL, setIsPL] = useState(false);
  const appDispatch = useContext(DispatchContext);
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState();
  const [todo, setTodo] = useState();
  const [doing, setDoing] = useState();
  const [done, setDone] = useState();
  const [closed, setClosed] = useState();
  const [groupList, setGroupList] = useState([]);
  let { name } = useParams();

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

  function handleClosedChange(event, values) {
    setClosed(values);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleCancel() {}

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
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
    <>
      <div className="container md-5">
        <Helmet>
          <title>View App</title>
        </Helmet>
        <h4>{name}</h4>
        <Grid container spacing={3}>
          <Grid item xs={6}>
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
            <div className="form-group">
              <label className="text-muted mb-1">
                <small>Permit Closed</small>
              </label>{" "}
              <Autocomplete
                size="small"
                options={groupList}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Permit closed" />
                )}
                onChange={handleClosedChange}
              />
            </div>
            {isPL ? (
              <div>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-sm btn-success"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  type="submit"
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </button>{" "}
              </div>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default ViewEditApp;
