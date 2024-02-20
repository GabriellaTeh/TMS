import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

function CreateApp() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState();
  const [todo, setTodo] = useState();
  const [doing, setDoing] = useState();
  const [done, setDone] = useState();
  const [closed, setClosed] = useState();
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

  function handleClosedChange(event, values) {
    setClosed(values);
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/home");
  }

  function handleCancel() {
    navigate("/home");
  }

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
              <small>Application Name</small>
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              type="text"
              placeholder="App name"
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Application Description</small>
            </label>
            <input
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Description"
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Start Date</small>
            </label>{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="Start date"
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>End Date </small>
            </label>{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="End date"
                onChange={(newValue) => {
                  setEndDate(newValue);
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
              multiple
              size="small"
              options={[]}
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
              multiple
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleTodoChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Doing</small>
            </label>{" "}
            <Autocomplete
              multiple
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleDoingChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Done</small>
            </label>{" "}
            <Autocomplete
              multiple
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleDoneChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Closed</small>
            </label>{" "}
            <Autocomplete
              multiple
              size="small"
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleClosedChange}
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
