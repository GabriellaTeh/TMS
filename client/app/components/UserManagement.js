import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../DispatchContext";

function UserManagement() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  function handleCreateUser(e) {}

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
              type="password"
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
