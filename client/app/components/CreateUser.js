import React, { useState, useContext, useRef } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import Select from "react-select";

function CreateUser(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);
  const appDispatch = useContext(DispatchContext);
  const selectInputRef = useRef();

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      if (username && password) {
        if (!email) {
          setEmail("");
        }
        let groupNames = [];
        if (groups) {
          groups.forEach((group) => {
            groupNames.push(group.value);
          });
        }
        const response = await Axios.post("/user/createUser", {
          username,
          password,
          email,
          groupNames,
        });
        if (response.data === "Username Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Username must be at least 3 characters and at most 20 characters.",
          });
        } else if (response.data === "Username Character") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Username can only contain alphanumeric characters.",
          });
        } else if (response.data === "Password Character") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must contain alphabet, number and special character.",
          });
        } else if (response.data === "Password Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must be at least 8 characters and at most 10 characters.",
          });
        } else if (response.data === "Invalid Email") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Invalid email format.",
          });
        } else if (response.data === "User exists") {
          appDispatch({
            type: "errorFlashMessage",
            value: "User already exists.",
          });
        } else if (response.data === "Email taken") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Email taken. Please choose another email.",
          });
        } else if (response.data === "Group Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Group name must be at least 3 characters and at most 20 characters.",
          });
        } else if (response.data === "Group Character") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Group name can only contain alphanumeric characters.",
          });
        } else if (response.data) {
          appDispatch({ type: "successFlashMessage", value: "User created." });
          props.setRefresh(true);
          e.target.reset();
        } else {
          appDispatch({ type: "errorFlashMessage", value: "Error" });
        }
      } else {
        appDispatch({
          type: "errorFlashMessage",
          value: "Username and Password required.",
        });
      }
      selectInputRef.current.clearValue();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="mt-3">
        <form onSubmit={handleCreateUser}>
          <div className="row align-items-center" style={{ width: "100%" }}>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setUsername(e.target.value)}
                className="form-control form-control-sm"
                type="text"
                placeholder="Username"
                autoComplete="off"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-sm"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-sm"
                type="text"
                placeholder="Email"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <Select
                ref={selectInputRef}
                isMulti
                placeholder="Groups"
                onChange={(newValue) => setGroups(newValue)}
                options={props.groupList}
              />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Create User</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateUser;
