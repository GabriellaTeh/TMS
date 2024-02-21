import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import StateContext from "../StateContext";
import Axios from "axios";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import CreatePlan from "./CreatePlan";

function Kanban() {
  let { name } = useParams();
  const appState = useContext(StateContext);
  const [isPL, setIsPL] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  function handlePlans() {
    setOpenPlan(true);
  }

  function handleClose() {
    setOpenPlan(false);
  }

  function handleAddTask() {}

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

  return (
    <>
      <Helmet>
        <title>{name} Kanban</title>
      </Helmet>
      <div className="d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">{name}</h4>
        <button onClick={handlePlans} className="btn btn-sm btn-info">
          Plans
        </button>
        <Dialog open={openPlan} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle>Plans</DialogTitle>
          <DialogContent>
            <CreatePlan />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <div className="text-white">...</div>
        {isPL ? (
          <button onClick={handleAddTask} className="btn btn-sm btn-primary">
            Add Task
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Kanban;
