import React, { useEffect } from "react";
import dayjs from "dayjs";

function ApplicationRow(props) {
  return (
    <>
      <tr key={props.name}>
        <td>{props.name}</td>
        <td>
          {props.startDate ? dayjs(props.startDate).format("DD-MM-YYYY") : "-"}{" "}
        </td>
        <td>
          {props.endDate ? dayjs(props.endDate).format("DD-MM-YYYY") : "-"}
        </td>
        <td>
          {props.isPL ? (
            <button className="btn btn-primary btn-sm">View/Edit</button>
          ) : (
            <button className="btn btn-primary btn-sm">View</button>
          )}
        </td>
      </tr>
    </>
  );
}

export default ApplicationRow;
