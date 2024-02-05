import React, { useState, useContext, useRef } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import CreatableSelect from "react-select/creatable";

function CreateUser() {
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
              "Username must be minimum 3 characters and maximum 20 characters",
          });
        } else if (response.data === "Username Character") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Username can only contain alphanumeric characters",
          });
        } else if (response.data === "Password Character") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must contain alphabet, number and special character",
          });
        } else if (response.data === "Password Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must be minimum 8 characters and maximum 10 characters",
          });
        } else if (response.data === "Invalid Email") {
          appDispatch({ type: "errorFlashMessage", value: "Invalid Email" });
        } else if (response.data === "User exists") {
          appDispatch({
            type: "errorFlashMessage",
            value: "User already exists",
          });
        } else if (response.data === "Group Length") {
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
          appDispatch({ type: "successFlashMessage", value: "User created" });
          e.target.reset();
        } else {
          appDispatch({ type: "errorFlashMessage", value: "Error" });
        }
      } else {
        appDispatch({
          type: "errorFlashMessage",
          value: "Username and Password required!",
        });
      }
      selectInputRef.current.clearValue();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <form onSubmit={handleCreateUser}>
        <div className="row container align-items-center">
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
            <CreatableSelect
              ref={selectInputRef}
              isMulti
              placeholder="Groups"
              onChange={(newValue) => setGroups(newValue)}
            />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Create User</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateUser;
