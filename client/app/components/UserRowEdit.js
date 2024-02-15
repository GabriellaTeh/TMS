import React, { useContext, useState } from "react";
import Axios from "axios";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import ToggleSwitchView from "./ToggleSwitchView";
import DispatchContext from "../DispatchContext";
import { Autocomplete, TextField } from "@mui/material";

function UserRowEdit(props) {
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isActive, setIsActive] = useState(true);
  const [groups, setGroups] = useState([]);
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
        if (isActive) {
          await activateUser(username);
        } else {
          await disableUser(username);
        }
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
    //delete all
    try {
      const res = await Axios.post("/group/removeUser", { username });
    } catch (err) {
      console.log(err);
    }
    //addition
    groups.forEach(async (group) => {
      const group_name = group.value;
      try {
        const response = await Axios.post("/group/addUser", {
          username,
          group_name,
        });
      } catch (err) {
        console.log(err);
      }
    });
    appDispatch({ type: "successMessage", value: "Groups updated." });
  }

  async function activateUser(username) {
    try {
      const response = await Axios.put("/user/activateUser", { username });
      if (response.data) {
        appDispatch({
          type: "successMessage",
          value: "Active status updated.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function disableUser(username) {
    try {
      const response = await Axios.put("/user/disableUser", { username });
      if (response.data) {
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
      <tr key={props.username}>
        <td>{props.username}</td>
        <td>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </td>
        <td>
          <input
            type="text"
            defaultValue={props.email}
            placeholder="New email"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChanged(true);
            }}
          />
        </td>
        <td>
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
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              renderInput={(params) => <TextField {...params} />}
              onChange={handleGroupChange}
            />
          )}
        </td>
        <td>
          {props.isDefaultAdmin ? (
            <ToggleSwitchView value={props.isActive === 1} />
          ) : (
            <ToggleSwitchEdit
              value={props.isActive === 1}
              setIsActive={setIsActive}
              setActiveChanged={setActiveChanged}
            />
          )}
        </td>
        <td>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save
          </button>{" "}
          <button onClick={handleCancel} className="btn btn-danger btn-sm">
            Cancel
          </button>
        </td>
      </tr>
    </>
  );
}

export default UserRowEdit;
