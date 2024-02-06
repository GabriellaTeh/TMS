import React, { useContext, useEffect, useState } from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import Axios from "axios";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import ToggleSwitchView from "./ToggleSwitchView";
import DispatchContext from "../DispatchContext";

function UserRowEdit(props) {
  const appDispatch = useContext(DispatchContext);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isActive, setIsActive] = useState(props.isActive);
  const [groups, setGroups] = useState(props.groups);
  const username = props.username;
  const id = props.id;
  const origGroups = props.groups;

  function handleSave() {
    if (email && password) {
      updateEmail(username, email);
      updatePassword(username, password);
    } else if (email) {
      updateEmail(username, email);
    } else if (password) {
      updatePassword(username, password);
    }
    if (isActive) {
      activateUser(username);
    } else {
      disableUser(username);
    }
    updateUserGroups(groups);
    props.setEdit(false);
  }

  async function updateUserGroups(groups) {
    //addition
    groups.forEach(async (group) => {
      if (group.__isNew__) {
        const group_name = group.value;
        const response = await Axios.post("/group/addUser", {
          id,
          group_name,
        });
        if (response.data === "Group Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Group name must be minimum 3 characters and maximum 20 characters",
          });
        } else if (response.data === "Group Character") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Group name can only contain alphanumeric characters",
          });
        } else if (response.data) {
          console.log("added user group");
        }
      }
    });
    //deletion
    for (let i = 0; i < origGroups.length; i++) {
      const group_name = origGroups[i].value;
      let found = false;
      for (let j = 0; j < groups.length; j++) {
        if (groups[j].value === group_name) {
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(group_name);
        const response = await Axios.post("/group/removeUser", {
          id,
          group_name,
        });
        if (response.data) {
          console.log("removed user group");
        }
      }
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

      if (response.data) {
        console.log("success");
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
            <CreatableSelect isMulti isDisabled defaultValue={props.groups} />
          ) : (
            <CreatableSelect
              isMulti
              placeholder="No groups"
              defaultValue={props.groups}
              onChange={(newValue) => setGroups(newValue)}
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
          </button>
        </td>
      </tr>
    </>
  );
}

export default UserRowEdit;
