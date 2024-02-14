import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import HeaderHomeUser from "./HeaderHomeUser";
import HeaderHomeAdmin from "./HeaderHomeAdmin";
import Axios from "axios";

function Header() {
  const appState = useContext(StateContext);
  const [isAdmin, setIsAdmin] = useState(false);

  async function checkAdmin() {
    try {
      const group_name = "admin";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsAdmin(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkAdmin();
  }, [appState.loggedIn]);

  useEffect(() => {
    checkAdmin();
  }, [appState.authChange]);

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/home" className="text-white">
              TMS
            </Link>
          </h4>
          {!appState.loggedIn ? (
            ""
          ) : isAdmin ? (
            <HeaderHomeAdmin />
          ) : (
            <HeaderHomeUser />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
