import React, { useContext, useState } from "react";
import Axios from "axios";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import ToggleSwitchView from "./ToggleSwitchView";
import DispatchContext from "../DispatchContext";
import { Autocomplete, TextField } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function UserRowEdit(props) {
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isActive, setIsActive] = useState(true);
  const [groups, setGroups] = useState(props.groups);
  const [groupChanged, setGroupChanged] = useState(false);
  const [activeChanged, setActiveChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const username = props.username;

  async function handleSave() {
    if (password) {
      updatePassword(username, password);
    }
    if (emailChanged) {
      updateEmail(username, email);
    }
    if (!props.isDefaultAdmin) {
      if (activeChanged) {
        await updateActiveStatus(username, isActive);
      }
      if (groupChanged) {
        await updateUserGroups(groups);
      }
    }
    props.setEdit(false);
    props.setRefresh(true);
  }

  function handleCancel() {
    props.setEdit(false);
    props.setRefresh(true);
  }

  async function updateUserGroups(groups) {
    try {
      const response = await Axios.post("/group/update", { username, groups });
      if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Unauthorized") {
        appDispatch({ type: "errorMessage", value: "Not authorized." });
        navigate("/home");
      } else if (response.data) {
        appDispatch({ type: "successMessage", value: "Groups updated." });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function updateActiveStatus(username, isActive) {
    try {
      const response = await Axios.post("/user/updateActive", {
        username,
        isActive,
      });
      if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Unauthorized") {
        appDispatch({ type: "errorMessage", value: "Not authorized." });
        navigate("/home");
      } else if (response.data) {
        appDispatch({
          type: "successMessage",
          value: "Active status updated.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function updateEmail(username, email) {
    try {
      const response = await Axios.put("/user/updateEmailAdmin", {
        username,
        email,
      });
      if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Unauthorized") {
        appDispatch({ type: "errorMessage", value: "Not authorized." });
        navigate("/home");
      } else {
        const data = response.data.split(" ");
        data.pop();
        if (data.length > 0) {
          if (data.includes("InvalidEmail")) {
            appDispatch({
              type: "errorMessage",
              value: "Invalid email format.",
            });
          }
          if (data.includes("EmailTaken")) {
            appDispatch({
              type: "errorMessage",
              value: "Email taken. Please choose another email.",
            });
          }
        } else {
          appDispatch({ type: "successMessage", value: "Email updated." });
        }
      }
      setEmail("");
    } catch (err) {
      console.log(err);
      setEmail("");
    }
  }

  async function updatePassword(username, password) {
    try {
      const response = await Axios.put("/user/updatePasswordAdmin", {
        username,
        password,
      });
      if (response.data === "Inactive") {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else if (response.data === "Jwt") {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else if (response.data === "Unauthorized") {
        appDispatch({ type: "errorMessage", value: "Not authorized." });
        navigate("/home");
      } else {
        const data = response.data.split(" ");
        data.pop();
        if (data.length > 0) {
          if (data.includes("PasswordCharacter")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Password must contain alphabet, number and special character.",
            });
          }
          if (data.includes("PasswordLength")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Password must be at least 8 characters and at most 10 characters long.",
            });
          }
        } else {
          appDispatch({ type: "successMessage", value: "Password updated." });
        }
      }
      setPassword("");
    } catch (err) {
      console.log(err);
      setPassword("");
    }
  }

  function handleGroupChange(event, values) {
    setGroups(values);
    setGroupChanged(true);
  }

  return (
    <>
      <TableRow>
        <TableCell align="center">{props.username}</TableCell>
        <TableCell align="center">
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </TableCell>
        <TableCell align="center">
          <input
            type="text"
            defaultValue={props.email}
            placeholder="New email"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChanged(true);
            }}
          />
        </TableCell>
        <TableCell align="center">
          {props.isDefaultAdmin ? (
            <Autocomplete
              multiple
              readOnly
              size="small"
              value={props.groups}
              options={props.groupList}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <Autocomplete
              multiple
              size="small"
              defaultValue={props.groups}
              options={props.groupList}
              renderInput={(params) => <TextField {...params} />}
              onChange={handleGroupChange}
            />
          )}
        </TableCell>
        <TableCell>
          {props.isDefaultAdmin ? (
            <ToggleSwitchView value={props.isActive === 1} />
          ) : (
            <ToggleSwitchEdit
              value={props.isActive === 1}
              setIsActive={setIsActive}
              setActiveChanged={setActiveChanged}
            />
          )}
        </TableCell>
        <TableCell align="center">
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save
          </button>{" "}
          <button onClick={handleCancel} className="btn btn-danger btn-sm">
            Cancel
          </button>
        </TableCell>
      </TableRow>
    </>
  );
}

export default UserRowEdit;
