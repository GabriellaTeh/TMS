import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PlanRowEdit from "./PlanRowEdit";

function PlanRow(props) {
  const [edit, setEdit] = useState(false);

  function handleEdit() {
    setEdit(true);
  }

  return (
    <>
      {edit ? (
        <PlanRowEdit
          name={props.name}
          startDate={props.startDate}
          endDate={props.endDate}
          setEdit={setEdit}
          setRefresh={props.setRefresh}
        />
      ) : (
        <TableRow>
          <TableCell align="center">{props.name}</TableCell>
          <TableCell align="center">
            {props.startDate
              ? dayjs(props.startDate).format("DD-MM-YYYY")
              : "-"}
          </TableCell>
          <TableCell align="center">
            {props.endDate ? dayjs(props.endDate).format("DD-MM-YYYY") : "-"}
          </TableCell>
          {props.isPM ? (
            <TableCell align="center">
              <button onClick={handleEdit} className="btn btn-secondary btn-sm">
                Edit
              </button>
            </TableCell>
          ) : (
            ""
          )}
        </TableRow>
      )}
    </>
  );
}

export default PlanRow;
