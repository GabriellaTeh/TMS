import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

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

  function handleCreateChange(event, values) {
    setCreate(values);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/app/edit", {
        name,
        description,
        startDate,
        endDate,
        create,
        open,
        todo,
        doing,
        done,
      });
      if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else if (response.data) {
        appDispatch({ type: "successMessage", value: "Application updated." });
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    navigate("/home");
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
      getGroupList();
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
