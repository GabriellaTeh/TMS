import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function PlanRowEdit(props) {
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
          {props.startDate ? dayjs(props.startDate).format("DD-MM-YYYY") : "-"}
        </TableCell>
        <TableCell align="center">
          {props.endDate ? dayjs(props.endDate).format("DD-MM-YYYY") : "-"}
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
