import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function ViewApp() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(null);
  const [todo, setTodo] = useState(null);
  const [doing, setDoing] = useState(null);
  const [done, setDone] = useState(null);
  const [create, setCreate] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const { name } = useParams();

  function handleCancel() {
    navigate("/home");
  }

  async function getAppDetails() {
    try {
      const response = await Axios.post("/app", { name });
      const data = response.data[0];
      setDescription(data.App_Description);
      if (data.App_startDate) {
        setStartDate(dayjs(data.App_startDate).format("YYYY-MM-DD"));
      } else {
        setStartDate(null);
      }
      if (data.App_endDate) {
        setEndDate(dayjs(data.App_endDate).format("YYYY-MM-DD"));
      } else {
        setEndDate(null);
      }
      if (data.App_permit_Create) {
        setCreate(data.App_permit_Create);
      }
      if (data.App_permit_Doing) {
        setDoing(data.App_permit_Doing);
      }
      if (data.App_permit_Done) {
        setDone(data.App_permit_Done);
      }
      if (data.App_permit_toDoList) {
        setTodo(data.App_permit_toDoList);
      }
      if (data.App_permit_Open) {
        setOpen(data.App_permit_Open);
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
      getAppDetails();
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
              value={description}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Start Date</small>
            </label>
            {"  "}
            <input type="date" readOnly value={startDate}></input>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>End Date </small>
            </label>
            {"  "}
            <input type="date" readOnly value={endDate}></input>
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
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit create" />
              )}
              value={create}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Open</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              value={open}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Todo</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit todo" />
              )}
              value={todo}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Doing</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit doing" />
              )}
              value={doing}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Done</small>
            </label>{" "}
            <Autocomplete
              size="small"
              readOnly
              options={groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit done" />
              )}
              value={done}
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
