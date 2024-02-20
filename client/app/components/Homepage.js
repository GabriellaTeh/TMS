import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import ApplicationRow from "./ApplicationRow";

function Homepage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isPL, setIsPL] = useState(false);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  async function verifyToken() {
    try {
      const response = await Axios.get("/verify");
      if (!response.data) {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else {
        checkActive();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function checkActive() {
    try {
      const response = await Axios.get("/checkActive");
      if (!response.data) {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        getAppTable();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getAppTable() {
    setApplications([]);
    try {
      const response = await Axios.get("/apps");
      if (response.data) {
        setApplications(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    } else {
      verifyToken();
    }
  }, []);

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkPL();
  }, [appState.loggedIn]);

  function handleCreateApp() {
    navigate("/createApp");
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">Applications</h4>
        {isPL ? (
          <button onClick={handleCreateApp} className="btn btn-sm btn-primary">
            Add application
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="mt-3">
        <table id="userTable" className="table table-hover">
          <thead>
            <tr>
              <th className="col-auto" scope="col">
                Acronym
              </th>
              <th className="col-auto" scope="col">
                Start Date
              </th>
              <th className="col-auto" scope="col">
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              return (
                <ApplicationRow
                  name={app.App_Acronym}
                  startDate={app.App_startDate}
                  endDate={app.App_endDate}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Homepage;
