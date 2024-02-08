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
        const data = response.data.split(" ");
        console.log(data);
        data.pop();
        if (data.length > 0) {
          if (data.includes("UsernameLength")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Username must be at least 3 characters and at most 20 characters.",
            });
          }
          if (data.includes("UsernameCharacter")) {
            appDispatch({
              type: "errorMessage",
              value: "Username can only contain alphanumeric characters.",
            });
          }
          if (data.includes("PasswordLength")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Password must be at least 8 characters and at most 10 characters.",
            });
          }
          if (data.includes("PasswordCharacter")) {
            appDispatch({
              type: "errorMessage",
              value:
                "Password must contain alphabet, number and special character.",
            });
          }
          if (data.includes("EmailTaken")) {
            appDispatch({
              type: "errorMessage",
              value: "Invalid email format.",
            });
          }
          if (data.includes("UserExists")) {
            appDispatch({
              type: "errorMessage",
              value: "User already exists.",
            });
          }
        } else {
          appDispatch({
            type: "successMessage",
            value: "User created.",
          });
        }
      } else {
        appDispatch({
          type: "errorMessage",
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
