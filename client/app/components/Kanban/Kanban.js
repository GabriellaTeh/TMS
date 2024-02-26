import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import StateContext from "../../StateContext";
import Axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Tooltip, setRef } from "@mui/material";
import PlanDialog from "./Plan/PlanDialog";
import AddTaskDialog from "./AddTaskDialog";
import TaskBoard from "./TaskBoard";

function Kanban() {
  let { name } = useParams();
  const appState = useContext(StateContext);
  const [isPL, setIsPL] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [plans, setPlans] = useState([]);

  function handlePlans() {
    setOpenPlan(true);
  }

  function handleClose() {
    setOpenPlan(false);
  }

  function handleAddTask() {
    setOpenAddTask(true);
  }

  function handleCloseTask() {
    setOpenAddTask(false);
  }

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getPlans() {
    setPlans([]);
    try {
      const response = await Axios.post("/plan/list", { name });
      const list = [];
      response.data.forEach((plan) => {
        list.push(plan.Plan_MVP_name);
      });
      setPlans(list);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkPL();
  }, [appState.loggedIn]);

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <>
      <Helmet>
        <title>{name} Kanban</title>
      </Helmet>
      <div className="d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Tooltip title="Applications" arrow>
            <Link to="/home" className="text-dark">
              <b>{name}</b>
            </Link>
          </Tooltip>
        </h4>
        <button onClick={handlePlans} className="btn btn-sm btn-info">
          Plans
        </button>
        <Dialog open={openPlan} onClose={handleClose} fullWidth maxWidth="lg">
          <DialogTitle>Plans</DialogTitle>
          <DialogContent>
            <PlanDialog />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <div className="text-white">...</div>
        {isPL ? (
          <>
            <button onClick={handleAddTask} className="btn btn-sm btn-success">
              Add Task
            </button>
            <Dialog
              open={openAddTask}
              onClose={handleCloseTask}
              fullWidth
              maxWidth="lg"
            >
              <DialogTitle>Create Task for {name}</DialogTitle>
              <DialogContent>
                <AddTaskDialog plans={plans} setOpenAddTask={setOpenAddTask} />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="mt-3">
        <TaskBoard appName={name} />
      </div>
    </>
  );
}

export default Kanban;
