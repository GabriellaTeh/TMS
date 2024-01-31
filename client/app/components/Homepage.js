import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function Homepage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

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
        <title>Home</title>
      </Helmet>
    </>
  );
}

export default Homepage;
