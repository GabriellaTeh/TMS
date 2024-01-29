import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  function handleLogout() {
    appDispatch({ type: "logout" });
    navigate("/");
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
