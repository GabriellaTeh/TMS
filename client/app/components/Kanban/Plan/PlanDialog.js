import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Axios from "axios";
import DispatchContext from "../../../DispatchContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PlanRow from "./PlanRow";

function PlanDialog() {
  const [planName, setPlanName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [isPM, setIsPM] = useState(false);
  const [refresh, setRefresh] = useState(false);
  let { name } = useParams();

  async function handleCreate(e) {
    e.preventDefault();
    if (planName) {
      if (startDate && endDate) {
        try {
          const response = await Axios.post("/plan/create", {
            planName,
            startDate,
            endDate,
            name,
          });
          if (response.data === "Jwt") {
            appDispatch({ type: "errorMessage", value: "Token invalid." });
            appDispatch({ type: "logout" });
            navigate("/");
          } else if (response.data === "Inactive") {
            navigate("/");
            appDispatch({ type: "errorMessage", value: "Inactive." });
          } else {
            const data = response.data.split(" ");
            data.pop();
            if (data.length > 0) {
              if (data.includes("PlanLength")) {
                appDispatch({
                  type: "errorMessage",
                  value: "Plan MVP name must be less than 20 characters.",
                });
              }
              if (data.includes("PlanCharacter")) {
                appDispatch({
                  type: "errorMessage",
                  value:
                    "Plan MVP name can only contain alphanumeric characters.",
                });
              }
              if (data.includes("PlanExists")) {
                appDispatch({
                  type: "errorMessage",
                  value: "Plan MVP name exists for this application.",
                });
              }
              if (data.includes("DatesInvalid")) {
                appDispatch({
                  type: "errorMessage",
                  value: "Start date must be before or equal to end date.",
                });
              }
            } else {
              appDispatch({
                type: "successMessage",
                value: "Plan created.",
              });
              e.target.reset();
              getPlanTable();
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        appDispatch({
          type: "errorMessage",
          value: "Start and End date required.",
        });
      }
    } else {
      appDispatch({ type: "errorMessage", value: "Plan MVP name required." });
    }
  }

  async function getPlanTable() {
    setPlans([]);
    try {
      const response = await Axios.post("/plans", { name });
      setPlans(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function checkPM() {
    try {
      const group_name = "projectmanager";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPM(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPlanTable();
    checkPM();
    setRefresh(false);
  }, [refresh]);

  return (
    <>
      {isPM ? (
        <div className="mt-3">
          <form onSubmit={handleCreate}>
            <TextField
              label="Plan Name"
              type="text"
              style={{ width: 400 }}
              size="small"
              onChange={(e) => setPlanName(e.target.value)}
            />
            {"   "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="Start date"
                format="DD-MM-YYYY"
                onChange={(newValue) => {
                  setStartDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
            </LocalizationProvider>{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                size="small"
                label="End date"
                format="DD-MM-YYYY"
                onChange={(newValue) => {
                  setEndDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
            </LocalizationProvider>{" "}
            <button className="btn btn-primary">Create Plan</button>
          </form>
        </div>
      ) : (
        ""
      )}
      <div className="mt-3">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>
                {isPM ? <TableCell></TableCell> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <PlanRow
                  name={plan.Plan_MVP_name}
                  startDate={
                    plan.Plan_startDate
                      ? dayjs(plan.Plan_startDate).format("YYYY-MM-DD")
                      : null
                  }
                  endDate={
                    plan.Plan_endDate
                      ? dayjs(plan.Plan_endDate).format("YYYY-MM-DD")
                      : null
                  }
                  isPM={isPM}
                  setRefresh={setRefresh}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default PlanDialog;
