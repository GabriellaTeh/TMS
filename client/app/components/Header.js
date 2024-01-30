import React, { useContext, useEffect } from "react";
import StateContext from "../StateContext";
import { Link } from "react-router-dom";
import HeaderHomeUser from "./HeaderHomeUser";
import HeaderOthers from "./HeaderOthers";

function Header() {
  const appState = useContext(StateContext);

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
          ) : appState.edit ? (
            <HeaderOthers />
          ) : (
            <HeaderHomeUser />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
