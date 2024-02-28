import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

function CreateUser(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      if (username && password) {
        if (!email) {
          setEmail("");
        }
        const response = await Axios.post("/user/createUser", {
          username,
          password,
          email,
          groups,
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
            if (data.includes("UsernameLength")) {
              appDispatch({
                type: "errorMessage",
                value:
                  "Username must be at least 3 characters and at most 20 characters long.",
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
                  "Password must be at least 8 characters and at most 10 characters long.",
              });
            }
            if (data.includes("PasswordCharacter")) {
              appDispatch({
                type: "errorMessage",
                value:
                  "Password must contain alphabet, number and special character.",
              });
            }
            if (data.includes("InvalidEmail")) {
              appDispatch({
                type: "errorMessage",
                value: "Invalid email format",
              });
            }
            if (data.includes("EmailTaken")) {
              appDispatch({
                type: "errorMessage",
                value: "Email taken. Please choose another email.",
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
            props.setRefresh(true);
            e.target.reset();
            setGroups([]);
          }
        }
      } else {
        appDispatch({
          type: "errorMessage",
          value: "Username and password required.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleGroupChange(event, values) {
    setGroups(values);
  }

  return (
    <>
      <div className="mt-3">
        <form onSubmit={handleCreateUser}>
          <div className="row align-items-center" style={{ width: "100%" }}>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Username"
                autoComplete="off"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Email"
              />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <Autocomplete
                multiple
                size="small"
                options={props.groupList}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Groups" />
                )}
                onChange={handleGroupChange}
                sx={{ width: "350px" }}
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
