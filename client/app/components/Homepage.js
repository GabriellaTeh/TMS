import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function Homepage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  async function verifyToken() {
    try {
      const response = await Axios.get("/verify");
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
    } else {
      verifyToken();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
    </>
  );
}

export default Homepage;
