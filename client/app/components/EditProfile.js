import React, { useContext, useState, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Helmet } from "react-helmet";

function EditProfile() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [userEmail, setUserEmail] = useState();

  async function getUserDetails() {
    try {
      const response = await Axios.get("/user/profile");
      if (response.data) {
        setUsername(response.data.username);
        setUserEmail(response.data.email);
      }
    } catch (err) {
      console.log(err);
      appDispatch({ type: "errorMessage", value: "Token invalid." });
      appDispatch({ type: "logout" });
      navigate("/");
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, []);

  async function updateEmail(email) {
    try {
      const response = await Axios.put("/user/updateEmail", { email });
      const data = response.data.split(" ");
      data.pop();
      if (data.length > 0) {
        if (data.includes("InvalidEmail")) {
          appDispatch({ type: "errorMessage", value: "Invalid email format." });
        }
        if (data.includes("EmailTaken")) {
          appDispatch({
            type: "errorMessage",
            value: "Email taken. Please choose another email.",
          });
        }
      } else {
        setEmail("");
        getUserDetails();
        appDispatch({ type: "successMessage", value: "Email updated." });
      }
      setEmail("");
    } catch (err) {
      console.log(err);
      setEmail("");
    }
  }

  async function updatePassword(password) {
    try {
      const response = await Axios.put("/user/updatePassword", { password });
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      updateEmail(email);
      updatePassword(password);
    } else if (email) {
      updateEmail(email);
    } else if (password) {
      updatePassword(password);
    } else {
      appDispatch({
        type: "errorMessage",
        value: "Key in new email/password to update.",
      });
    }
    e.target.reset();
  }
  return (
    <>
      <div className="container py-md-5">
        <Helmet>
          <title>My Profile</title>
        </Helmet>
        <div className="row align-items-center">
          <div className="col-lg-7 py-3 py-md-5">
            <h1 className="display-3">My details</h1>
            <p className="lead text-muted">Username: {username}</p>
            <p className="lead text-muted">Email: {userEmail}</p>
          </div>
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="text-muted mb-1">
                  <small>New Email</small>
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  type="text"
                  placeholder="New email"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label className="text-muted mb-1">
                  <small>New Password</small>
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  type="password"
                  placeholder="New password"
                />
              </div>
              <button
                type="submit"
                className="py-3 mt-4 btn btn-lg btn-success btn-block"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
