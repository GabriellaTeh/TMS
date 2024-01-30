import React, { useContext, useState, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import { Helmet } from "react-helmet";

function EditProfile() {
  const appDispatch = useContext(DispatchContext);
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
      } else {
        //TODO: dispatch msg for expired token
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (email) {
      try {
        const response = await Axios.put("/user/updateEmail", { email });
        if (response.data === "Invalid") {
          appDispatch({ type: "errorFlashMessage", value: "Invalid Email" });
        } else if (response.data) {
          setEmail("");
          getUserDetails();
          appDispatch({ type: "successFlashMessage", value: "Updated" });
        } else {
          appDispatch({ type: "errorFlashMessage", value: "Error" });
          setEmail("");
        }
      } catch (err) {
        console.log(err);
        setEmail("");
      }
    }
    if (password) {
      try {
        const res = await Axios.put("/user/updatePassword", { password });
        if (res.data === "Character") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must contain alphabet, number and special character",
          });
        } else if (res.data === "Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Password must be minimum 8 characters and maximum 10 characters",
          });
        } else if (res.data) {
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
