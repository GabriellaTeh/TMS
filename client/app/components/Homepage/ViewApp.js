import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function ViewApp(props) {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  function handleCancel() {
    navigate("/home");
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    }
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Application Description</small>
            </label>
            <TextField
              fullWidth
              readOnly
              multiline
              rows={8}
              value={props.description}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Start Date</small>
            </label>
            {"  "}
            <input type="date" readOnly value={props.startDate}></input>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>End Date </small>
            </label>
            {"  "}
            <input type="date" readOnly value={props.endDate}></input>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Create</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit create" />
              )}
              value={props.create}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Open</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              value={props.open}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Todo</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit todo" />
              )}
              value={props.todo}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Doing</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit doing" />
              )}
              value={props.doing}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Done</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={[]}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit done" />
              )}
              value={props.done}
            />
          </div>
          <div>
            <button
              onClick={handleCancel}
              type="submit"
              className="btn btn-sm btn-secondary"
            >
              Back
            </button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default ViewApp;
