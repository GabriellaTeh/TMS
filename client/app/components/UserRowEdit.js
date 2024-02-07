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
  const id = props.id;

  async function handleSave() {
    if (email && password) {
      await updateEmail(username, email);
      await updatePassword(username, password);
    } else if (email) {
      await updateEmail(username, email);
    } else if (password) {
      await updatePassword(username, password);
    }
    if (isActive) {
      await activateUser(username);
    } else {
      await disableUser(username);
    }
    await updateUserGroups(groups);
    props.setEdit(false);
    props.setRefresh(true);
  }

  function handleCancel() {
    props.setEdit(false);
    props.setRefresh(true);
  }

  async function updateUserGroups(groups) {
    //delete all
    const res = await Axios.post("/group/removeUser", { id });
    //addition
    for (let i = 0; i < groups.length; i++) {
      const group_name = groups[i].value;
      const response = await Axios.post("/group/addUser", {
        id,
        group_name,
      });
    }
  }

  async function activateUser(username) {
    try {
      const response = await Axios.put("/user/activateUser", { username });

      if (response.data) {
        console.log("success");
      }
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
      if (response.data === "Invalid Email") {
        appDispatch({ type: "errorFlashMessage", value: "Invalid email" });
      } else if (response.data) {
        appDispatch({ type: "successFlashMessage", value: "Updated" });
      } else {
        appDispatch({ type: "errorFlashMessage", value: "Error" });
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
      if (response.data === "Password Character") {
        appDispatch({
          type: "errorFlashMessage",
          value: "Password must contain alphabet, number and special character",
        });
      } else if (response.data === "Password Length") {
        appDispatch({
          type: "errorFlashMessage",
          value:
            "Password must be minimum 8 characters and maximum 10 characters",
        });
      } else if (response.data) {
        appDispatch({ type: "successFlashMessage", value: "Updated" });
      } else {
        appDispatch({ type: "errorFlashMessage", value: "Error" });
      }
      setPassword("");
    } catch (err) {
      console.log(err);
      setPassword("");
    }
  }

  return (
    <>
      <tr key={props.id}>
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
