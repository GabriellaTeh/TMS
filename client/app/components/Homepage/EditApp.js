import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function EditApp(props) {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const [description, setDescription] = useState(props.description);
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [open, setOpen] = useState(props.open);
  const [todo, setTodo] = useState(props.todo);
  const [doing, setDoing] = useState(props.doing);
  const [done, setDone] = useState(props.done);
  const [create, setCreate] = useState(props.create);
  const [startDateCleared, setStartDateCleared] = useState(false);
  const [endDateCleared, setEndDateCleared] = useState(false);
  const [startDateChanged, setStartDateChanged] = useState(false);
  const [endDateChanged, setEndDateChanged] = useState(false);

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
      } else if (startDateChanged) {
        obj.startDate = dayjs(startDate).format("YYYY-MM-DD");
      } else {
        obj.startDate = props.startDate;
      }
      if (endDateCleared) {
        obj.endDate = null;
      } else if (endDateChanged) {
        obj.endDate = dayjs(endDate).format("YYYY-MM-DD");
      } else {
        obj.endDate = props.endDate;
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
            <TextField
              fullWidth
              multiline
              rows={8}
              defaultValue={props.description}
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
                value={dayjs(props.startDate)}
                onChange={(newValue) => {
                  setStartDate(dayjs(newValue).format("YYYY-MM-DD"));
                  setStartDateChanged(true);
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
                value={dayjs(props.endDate)}
                onChange={(newValue) => {
                  setEndDate(dayjs(newValue).format("YYYY-MM-DD"));
                  setEndDateChanged(true);
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
              options={props.groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit create" />
              )}
              onChange={handleCreateChange}
              value={props.create}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Open</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={props.groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit open" />
              )}
              onChange={handleOpenChange}
              value={props.open}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Todo</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={props.groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit todo" />
              )}
              onChange={handleTodoChange}
              value={props.todo}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Doing</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={props.groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit doing" />
              )}
              onChange={handleDoingChange}
              value={props.doing}
            />
          </div>
          <div className="form-group">
            <label className="text-muted mb-1">
              <small>Permit Done</small>
            </label>{" "}
            <Autocomplete
              size="small"
              options={props.groupList}
              renderInput={(params) => (
                <TextField {...params} placeholder="Permit done" />
              )}
              onChange={handleDoneChange}
              value={props.done}
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
    </>
  );
}

export default EditApp;
