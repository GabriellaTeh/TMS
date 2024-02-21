import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import EditApp from "./EditApp";
import ViewApp from "./ViewApp";

function AppDetails() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [isPL, setIsPL] = useState(false);
  const appDispatch = useContext(DispatchContext);
  let { name } = useParams();

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    } else {
      checkPL();
    }
  }, []);

  return (
    <>
      <div className="container md-5">
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <h4>{name}</h4>
        {isPL ? <EditApp /> : <ViewApp />}
      </div>
    </>
  );
}

export default AppDetails;
