import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";
import dayjs from "dayjs";
import ViewApp from "./ViewApp";
import Grid from "@mui/material/Grid";
import { Autocomplete, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function AppDetails() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [isPL, setIsPL] = useState(false);
  const appDispatch = useContext(DispatchContext);
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState(null);
  const [todo, setTodo] = useState(null);
  const [doing, setDoing] = useState(null);
  const [done, setDone] = useState(null);
  const [create, setCreate] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [startDateCleared, setStartDateCleared] = useState(false);
  const [endDateCleared, setEndDateCleared] = useState(false);
  let { name } = useParams();

  async function checkPL() {
    try {
      const group_name = "projectlead";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
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
      getAppDetails();
      getGroupList();
    }
  }, []);

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
      let obj = { name };
      if (description) {
        obj.description = description;
      }
      if (startDateCleared) {
        obj.startDate = null;
      } else {
        obj.startDate = startDate;
      }
      if (endDateCleared) {
        obj.endDate = null;
      } else {
        obj.endDate = endDate;
      }
      if (open) {
        obj.open = open;
      }
      if (todo) {
        obj.todo = todo;
      }
      if (doing) {
        obj.doing = doing;
      }
      if (done) {
        obj.done = done;
      }
      if (create) {
        obj.create = create;
      }
      const response = await Axios.post("/app/edit", obj);
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
          if (data.includes("DatesInvalid")) {
            appDispatch({
              type: "errorMessage",
              value: "Start date must be before or equal to end date.",
            });
          }
        } else {
          appDispatch({
            type: "successMessage",
            value: "Application updated.",
          });
          navigate("/home");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate("/home");
  }

  return (
    <>
      <div className="container md-5">
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <h4>{name}</h4>
        {isPL ? (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div className="form-group">
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Application description"
                ></TextField>
              </div>
              <div className="form-group">
                <label className="text-muted mb-1">
                  <small>Start Date</small>
                </label>
                {"  "}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={dayjs(startDate)}
                    onChange={(newValue) => {
                      setStartDate(dayjs(newValue).format("YYYY-MM-DD"));
                    }}
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => setStartDateCleared(true),
                      },
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
                  <DatePicker
                    label="End Date"
                    value={dayjs(endDate)}
                    onChange={(newValue) => {
                      setEndDate(dayjs(newValue).format("YYYY-MM-DD"));
                    }}
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => setEndDateCleared(true),
                      },
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
                  onChange={(event, newValue) => {
                    setCreate(newValue);
                  }}
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
            </Grid>
          </Grid>
        ) : (
          <ViewApp
            description={description}
            startDate={startDate}
            endDate={endDate}
            create={create}
            doing={doing}
            done={done}
            todo={todo}
            open={open}
          />
        )}
      </div>
    </>
  );
}

export default AppDetails;
