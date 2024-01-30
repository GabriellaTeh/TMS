import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";
Axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Header from "./components/Header";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import EditProfile from "./components/EditProfile";
import SuccessFlashMessage from "./components/SuccessFlashMessage";
import ErrorFlashMessage from "./components/ErrorFlashMessage";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    token: localStorage.getItem("token"),
    successFlashMessages: [],
    errorFlashMessages: [],
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.token = action.data.token;
        Axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.data.token}`;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "successFlashMessage":
        draft.successFlashMessages.push(action.value);
        return;
      case "errorFlashMessage":
        draft.errorFlashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
      Axios.defaults.headers.common["Authorization"] = null;
    }
  }, [state.loggedIn, state.token]);

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <SuccessFlashMessage messages={state.successFlashMessages} />
            <ErrorFlashMessage messages={state.errorFlashMessages} />
            <Header />
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/home" element={<Homepage />}></Route>
              <Route path="/profile" element={<EditProfile />}></Route>
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
