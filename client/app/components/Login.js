import React, { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function Login(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/user/login", { username, password });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        navigate("/home");
      } else {
        //TODO: flash incorrect username/password
      }
    } catch (err) {
      console.log("there was a error");
    }
  }
  return (
    <div className="container py-md-5">
      <div className="pls-center">
        <div
          className="pls-center row align-items-center"
          style={{ width: "100%" }}
        >
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  id="username-register"
                  name="username"
                  className="form-control"
                  type="text"
                  placeholder="Username"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password-register" className="text-muted mb-1">
                  <small>Password</small>
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password-register"
                  name="password"
                  className="form-control"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="py-3 mt-4 btn btn-lg btn-success btn-block"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
