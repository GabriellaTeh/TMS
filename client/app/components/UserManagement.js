import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../DispatchContext";

function UserManagement() {
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
        <title>Manage Users</title>
      </Helmet>
    </>
  );
}

export default UserManagement;
