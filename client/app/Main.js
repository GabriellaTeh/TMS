import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";
Axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
  "token"
)}`;

import Login from "./components/Login";
import Homepage from "./components//Homepage/Homepage";
import Header from "./components/Header/Header";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import EditProfile from "./components/EditProfile";
import UserManagement from "./components/UserManagement/UserManagement";
import CreateApp from "./components/Homepage/CreateApp";
import AppDetails from "./components/Homepage/AppDetails";
import Kanban from "./components/Kanban";

function Main() {
  const initialState = {
    loggedIn: Boolean(Cookies.get("token")),
    token: Cookies.get("token"),
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
      case "successMessage":
        toast.success(action.value);
        return;
      case "errorMessage":
        toast.error(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      Cookies.set("token", state.token);
    } else {
      Cookies.remove("token");
      Axios.defaults.headers.common["Authorization"] = null;
    }
  }, [state.loggedIn, state.token]);

  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/home" element={<Homepage />}></Route>
              <Route path="/profile" element={<EditProfile />}></Route>
              <Route path="/manage" element={<UserManagement />}></Route>
              <Route path="/createApp" element={<CreateApp />}></Route>
              <Route path="/app/:name" element={<AppDetails />}></Route>
              <Route path="/kanban/:name" element={<Kanban />}></Route>
              <Route path={"*"} element={<Navigate to="/" />}></Route>
            </Routes>
            <ToastContainer position="top-center" autoClose={1250} />
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
