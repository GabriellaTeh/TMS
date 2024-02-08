import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function HeaderHomeUser() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  function handleLogout() {
    appDispatch({ type: "logout" });
    navigate("/");
  }
  function handleEditProfile() {
    navigate("/profile");
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <button onClick={handleEditProfile} className="btn btn-sm btn-secondary">
        My Profile
      </button>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Log Out
      </button>
    </div>
  );
}

export default HeaderHomeUser;
