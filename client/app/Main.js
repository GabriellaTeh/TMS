import React from "react";
import ReactDOM from "react-dom";

function Main() {
  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <a href="/" className="text-white">
              {" "}
              TMS{" "}
            </a>
          </h4>
        </div>
      </header>

      <div className="container py-md-5">
        <div className="pls-center">
          <div
            className="pls-center row align-items-center"
            style={{ width: "100%" }}
          >
            <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
              <form>
                <div className="form-group">
                  <label for="username-register" className="text-muted mb-1">
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
                  <label for="password-register" className="text-muted mb-1">
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
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
