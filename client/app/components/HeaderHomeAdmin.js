import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function HeaderHomeAdmin() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  function handleUserManagement() {
    appDispatch({ type: "edit" });
    navigate("/manage");
  }

  function handleLogout() {
    appDispatch({ type: "logout" });
    navigate("/");
  }
  function handleEditProfile() {
    appDispatch({ type: "edit" });
    navigate("/profile");
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <button
        onClick={handleUserManagement}
        className="btn btn-sm btn-secondary"
      >
        Manage Users
      </button>{" "}
      <button onClick={handleEditProfile} className="btn btn-sm btn-secondary">
        Edit Profile
      </button>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderHomeAdmin;
