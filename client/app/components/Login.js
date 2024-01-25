import React from "react";
import ReactDOM from "react-dom/client";

function Login() {
  return (
    <div className="container py-md-5">
      <div className="pls-center">
        <div
          className="pls-center row align-items-center"
          style={{ width: "100%" }}
        >
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <form>
              <div className="form-group">
                <label htmlFor="username-register" className="text-muted mb-1">
                  <small>Username</small>
                </label>
                <input
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
