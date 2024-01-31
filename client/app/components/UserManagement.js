import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function UserManagement() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

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
            value: "Username can only contains alphanumeric characters",
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
        } else if (response.data) {
          appDispatch({ type: "successFlashMessage", value: "User created" });
        } else {
          appDispatch({ type: "errorFlashMessage", value: "Error" });
        }
      } else {
        appDispatch({
          type: "errorFlashMessage",
          value: "Username and Password required!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorFlashMessage", value: "Please log in" });
      navigate("/");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Users</title>
      </Helmet>
      <form onSubmit={handleCreateUser} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
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
            <input
              className="form-control form-control-sm"
              type="password"
              placeholder="Groups"
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

export default UserManagement;
