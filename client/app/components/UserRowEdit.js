import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import Axios from "axios";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import ToggleSwitchView from "./ToggleSwitchView";
import DispatchContext from "../DispatchContext";

function UserRowEdit(props) {
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isActive, setIsActive] = useState();
  const username = props.username;

  function handleSave() {
    if (email && password) {
      updateEmail(username, email);
      updatePassword(username, password);
    } else if (email) {
      updateEmail(username, email);
    } else if (password) {
      updatePassword(username, password);
    }
    props.setEdit(false);
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
              options={props.groups}
              defaultValue={props.groups}
            />
          )}
        </td>
        <td>
          {props.isDefaultAdmin ? (
            <ToggleSwitchView value={props.isActive === 1 ? true : false} />
          ) : (
            <ToggleSwitchEdit value={props.isActive === 1 ? true : false} />
          )}
        </td>
        <td>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save
          </button>
        </td>
      </tr>
    </>
  );
}

export default UserRowEdit;
