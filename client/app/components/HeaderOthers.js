import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function HeaderOthers() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  function handleLogout() {
    appDispatch({ type: "logout" });
    navigate("/");
  }

  function handleHome() {
    appDispatch({ type: "home" });
    navigate("/home");
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <button onClick={handleHome} className="btn btn-sm btn-secondary">
        Home
      </button>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderOthers;
