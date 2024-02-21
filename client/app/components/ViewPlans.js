import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import Paper from "@mui/material/Paper";
import Axios from "axios";

function ViewPlans() {
  const [plans, setPlans] = useState([]);

  async function getPlanTable() {
    setPlans([]);
    try {
      const response = await Axios.get("/plans");
      setPlans(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPlanTable();
  }, []);

  return (
    <>
      <div className="mt-3">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {applications.map((app) => (
                <TableRow>
                  <TableCell align="center">
                    <Link to={`/kanban/${app.App_Acronym}`}>
                      {app.App_Acronym}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {app.App_startDate
                      ? dayjs(app.App_startDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {app.App_endDate
                      ? dayjs(app.App_endDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {isPL ? (
                      <Link to={`/app/${app.App_Acronym}`}>View/Edit</Link>
                    ) : (
                      <Link to={`/app/${app.App_Acronym}`}>View</Link>
                    )}
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ViewPlans;
