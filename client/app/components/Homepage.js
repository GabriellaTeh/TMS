import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import { Tooltip } from "@mui/material";

function Homepage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [isPL, setIsPL] = useState(false);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  async function verifyToken() {
    try {
      const response = await Axios.get("/verify");
      if (!response.data) {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else {
        checkActive();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function checkActive() {
    try {
      const response = await Axios.get("/checkActive");
      if (!response.data) {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        getAppTable();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getAppTable() {
    setApplications([]);
    try {
      const response = await Axios.get("/apps");
      if (response.data) {
        setApplications(response.data);
      }
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
      verifyToken();
    }
  }, []);

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
    checkPL();
  }, [appState.loggedIn]);

  function handleCreateApp() {
    navigate("/createApp");
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">Applications</h4>
        {isPL ? (
          <button onClick={handleCreateApp} className="btn btn-sm btn-primary">
            Add application
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="mt-3">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Acronym</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow>
                  <TableCell align="center">
                    <Tooltip title={`View Kanban`} arrow>
                      <Link to={`/kanban/${app.App_Acronym}`}>
                        {app.App_Acronym}
                      </Link>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {app.App_startDate
                      ? dayjs(app.App_startDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {app.App_endDate
                      ? dayjs(app.App_endDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {isPL ? (
                      <Link to={`/app/${app.App_Acronym}`}>View/Edit</Link>
                    ) : (
                      <Link to={`/app/${app.App_Acronym}`}>View</Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default Homepage;
