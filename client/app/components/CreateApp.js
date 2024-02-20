import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Autocomplete, TextField } from "@mui/material";

function CreateApp() {
  function handleSubmit() {}
  return (
    <div className="container md-5">
      <Helmet>
        <title>Create App</title>
      </Helmet>
      <h3>Create Application</h3>
      <div className="form-group">
        <label className="text-muted mb-1">
          <small>Application Name</small>
        </label>
        <input className="form-control" type="text" placeholder="App name" />
      </div>
      <div className="form-group">
        <label className="text-muted mb-1">
          <small>Application Description</small>
        </label>
        <input className="form-control" placeholder="Description" />
      </div>
      <div className="form-group">
        <label className="text-muted mb-1">
          <small>Start Date</small>
        </label>{" "}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField size="small" label="Start date" />
        </LocalizationProvider>
      </div>
      <div className="form-group">
        <label className="text-muted mb-1">
          <small>End Date </small>
        </label>{" "}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField size="small" label="End date" />
        </LocalizationProvider>
      </div>
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
          sx={{ width: "350px" }}
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
          sx={{ width: "350px" }}
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
          sx={{ width: "350px" }}
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
          sx={{ width: "350px" }}
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
          sx={{ width: "350px" }}
        />
      </div>
      <button
        onClick={handleSubmit}
        type="submit"
        className="btn btn-sm btn-success"
      >
        Create
      </button>
    </div>
  );
}

export default CreateApp;
