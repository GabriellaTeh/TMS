import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  let { name } = useParams();

  async function getPlanTable() {
    setPlans([]);
    try {
      const response = await Axios.post("/plans", { name });
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
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow>
                  <TableCell align="center">{plan.Plan_MVP_name}</TableCell>
                  <TableCell align="center">
                    {plan.Plan_startDate
                      ? dayjs(plan.Plan_startDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {plan.Plan_endDate
                      ? dayjs(plan.Plan_endDate).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ViewPlans;
