import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import HeaderHomeUser from "./HeaderHomeUser";
import HeaderOthers from "./HeaderOthers";
import HeaderHomeAdmin from "./HeaderHomeAdmin";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function Header() {
  const appState = useContext(StateContext);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
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

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <a href="" className="text-white">
              TMS
            </a>
          </h4>
          {!appState.loggedIn ? (
            ""
          ) : path === "/home" ? (
            isAdmin ? (
              <HeaderHomeAdmin />
            ) : (
              <HeaderHomeUser />
            )
          ) : (
            <HeaderOthers />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
