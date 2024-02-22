import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function CreatePlan() {
  const [planName, setPlanName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  let { name } = useParams();

  async function handleCreate(e) {
    e.preventDefault();
    if (name) {
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
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      appDispatch({ type: "errorMessage", value: "Plan MVP name required." });
    }
  }

  return (
    <>
      <form onSubmit={handleCreate}>
        <TextField
          required
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
    </>
  );
}

export default CreatePlan;
