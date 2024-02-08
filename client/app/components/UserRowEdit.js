import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Axios from "axios";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import ToggleSwitchView from "./ToggleSwitchView";
import DispatchContext from "../DispatchContext";

function UserRowEdit(props) {
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isActive, setIsActive] = useState(true);
  const [groups, setGroups] = useState([]);
  const username = props.username;
  const isDefaultAdmin = props.username === "admin";

  async function handleSave() {
    if (password) {
      await updatePassword(username, password);
    }
    await updateEmail(username, email);
    if (!isDefaultAdmin) {
      if (isActive) {
        await activateUser(username);
      } else {
        await disableUser(username);
      }
      await updateUserGroups(groups);
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
  }

  async function activateUser(username) {
    try {
      const response = await Axios.put("/user/activateUser", { username });
    } catch (err) {
      console.log(err);
    }
  }

  async function disableUser(username) {
    try {
      const response = await Axios.put("/user/disableUser", { username });
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

  return (
    <>
      <tr key={props.username}>
        <td>
          <input type="text" readOnly={true} value={props.username} />
        </td>
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </td>
        <td>
          {props.isDefaultAdmin ? (
            <Select isMulti isDisabled defaultValue={props.groups} />
          ) : (
            <Select
              isMulti
              placeholder="No groups"
              defaultValue={props.groups}
              onChange={(newValue) => setGroups(newValue)}
              options={props.groupList}
            />
          )}
        </td>
        <td>
          {props.isDefaultAdmin ? (
            <ToggleSwitchView value={props.isActive === 1 ? true : false} />
          ) : (
            <ToggleSwitchEdit
              value={props.isActive === 1 ? true : false}
              setIsActive={setIsActive}
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
