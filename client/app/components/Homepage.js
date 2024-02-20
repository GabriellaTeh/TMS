import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function Homepage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isPL, setIsPL] = useState(false);
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
    </>
  );
}

export default Homepage;
