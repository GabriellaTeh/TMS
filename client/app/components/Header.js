import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import StateContext from "../StateContext";
import HeaderHomeUser from "./HeaderHomeUser";
import HeaderOthers from "./HeaderOthers";
import HeaderHomeAdmin from "./HeaderHomeAdmin";

function Header() {
  const appState = useContext(StateContext);
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <a href="" className="text-white">
              TMS
            </a>
          </h4>
          {!appState.loggedIn ? (
            ""
          ) : path === "/home" ? (
            <HeaderHomeUser />
          ) : (
            <HeaderOthers />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
