import React, { useState } from "react";
import ToggleSwitchView from "./ToggleSwitchView";
import UserRowEdit from "./UserRowEdit";
import { Autocomplete, TextField } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function UserRow(props) {
  const [edit, setEdit] = useState(false);
  const isDefaultAdmin = props.username === "admin";

  function handleEdit() {
    setEdit(true);
  }

  return (
    <>
      {edit ? (
        <UserRowEdit
          username={props.username}
          email={props.email}
          isActive={props.isActive}
          groups={props.groups}
          groupList={props.groupList}
          setEdit={setEdit}
          isDefaultAdmin={isDefaultAdmin}
          setRefresh={props.setRefresh}
        />
      ) : (
        <TableRow>
          <TableCell align="center">{props.username}</TableCell>
          <TableCell align="center">........</TableCell>
          <TableCell align="center">{props.email}</TableCell>
          <TableCell align="center">
            {" "}
            <Autocomplete
              multiple
              size="small"
              readOnly
              defaultValue={props.groups}
              options={[]}
              renderInput={(params) => <TextField {...params} />}
            />
          </TableCell>
          <TableCell align="center">
            <ToggleSwitchView value={props.isActive === 1 ? true : false} />
          </TableCell>
          <TableCell align="center">
            <button onClick={handleEdit} className="btn btn-secondary btn-sm">
              Edit
            </button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default UserRow;
