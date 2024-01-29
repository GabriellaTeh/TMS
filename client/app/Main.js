import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Header from "./components/Header";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    token: localStorage.getItem("token"),
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [state.loggedIn]);

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/home" element={<Homepage />}></Route>
            </Routes>
          </BrowserRouter>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
