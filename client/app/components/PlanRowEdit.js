import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function PlanRowEdit(props) {
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);

  function handleSave() {
    props.setEdit(false);
    props.setRefresh(true);
  }

  function handleCancel() {
    props.setEdit(false);
    props.setRefresh(true);
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
