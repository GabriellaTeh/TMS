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

function EditApp() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [isPL, setIsPL] = useState(false);
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
    try {
      // const response = await Axios.post("/app/edit", {})
    } catch (err) {
      console.log(err);
    }
    navigate("/home");
  }

  function handleCancel() {
    navigate("/home");
  }

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
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
      getGroupList();
      checkPL();
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
              multiline
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextField>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Start Date</small>
            </label>
            {"  "}
            <input
              type="date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue.target.value);
              }}
            ></input>
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>End Date </small>
            </label>
            {"  "}
            <input
              type="date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue.target.value);
              }}
            ></input>
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
              value={create}
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
              value={open}
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
              value={todo}
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
              value={doing}
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
              value={done}
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
              </button>{" "}
              <button
                onClick={handleCancel}
                type="submit"
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default EditApp;
