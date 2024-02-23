import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Tooltip } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

function OpenTaskRow(props) {
  return (
    <>
      <TableRow>
        <TableCell align="center">
          <Card variant="outlined" style={{ backgroundColor: "pink" }}>
            <CardContent>
              <button className="task-button" onClick={props.handleViewTask}>
                <u>
                  {props.name} ({props.id})
                </u>
              </button>
              <Dialog
                open={props.openViewTask}
                onClose={props.handleClose}
                fullWidth
                maxWidth="lg"
              >
                <DialogTitle>Task</DialogTitle>
                <DialogContentText></DialogContentText>
                <DialogContent></DialogContent>
                <DialogActions>
                  <Button onClick={props.handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </TableCell>
      </TableRow>
    </>
  );
}

export default OpenTaskRow;
