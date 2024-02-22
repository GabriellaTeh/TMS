import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function PlanRowEdit(props) {
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const appDispatch = useContext(DispatchContext);
  let { name } = useParams();
  const planName = props.name;

  async function handleSave(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/plan/edit", {
        name,
        startDate,
        endDate,
        planName,
      });
      console.log(response.data);
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
          if (data.includes("DatesInvalid")) {
            appDispatch({
              type: "errorMessage",
              value: "Start date must be before or equal to end date.",
            });
          }
        } else {
          appDispatch({
            type: "successMessage",
            value: "Plan updated.",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
    props.setEdit(false);
    props.setRefresh(true);
  }

  function handleCancel() {
    props.setEdit(false);
  }

  return (
    <>
      <TableRow>
        <TableCell align="center">{props.name}</TableCell>
        <TableCell align="center">
          <input
            type="date"
            defaultValue={props.startDate}
            onChange={(newValue) => {
              setStartDate(newValue.target.value);
            }}
          ></input>
        </TableCell>
        <TableCell align="center">
          <input
            type="date"
            defaultValue={props.endDate}
            onChange={(newValue) => {
              setEndDate(newValue.target.value);
            }}
          ></input>
        </TableCell>
        <TableCell align="center">
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save
          </button>{" "}
          <button onClick={handleCancel} className="btn btn-danger btn-sm">
            Cancel
          </button>
        </TableCell>
      </TableRow>
    </>
  );
}

export default PlanRowEdit;
