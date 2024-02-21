import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

function CreatePlan() {
  return (
    <>
      <TextField
        required
        label="Email Address"
        type="email"
        style={{ width: 400 }}
        size="small"
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
    </>
  );
}

export default CreatePlan;
