import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Tooltip } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { TextField, Autocomplete } from "@mui/material";

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
                <DialogContent>
                  Created by {props.creator} on{" "}
                  {dayjs(props.createDate).format("DD-MM-YYYY")} <br></br>{" "}
                  Owner: {props.owner} <br></br> State: open
                </DialogContent>
                <DialogContent>
                  {" "}
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <div className="form-group">
                        <TextField size="small" label="Task name"></TextField>
                      </div>
                      <div className="form-group">
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          label="Task description"
                        ></TextField>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="form-group">
                        <label className="text-muted mb-1">
                          <small>Plan Name</small>
                        </label>
                        <Autocomplete
                          size="small"
                          options={props.plans}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Plans" />
                          )}
                        />
                      </div>
                      <div className="form-group">
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          label="Task notes"
                        ></TextField>
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
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
