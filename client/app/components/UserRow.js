import React, { useState } from "react";
import ToggleSwitchView from "./ToggleSwitchView";
import UserRowEdit from "./UserRowEdit";
import { Autocomplete, TextField } from "@mui/material";

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
        <tr key={props.username}>
          <td>
            <input type="text" readOnly={true} value={props.username} />
          </td>
          <td>
            <input type="password" readOnly={true} value="......." />
          </td>
          <td>
            <input
              type="text"
              readOnly={true}
              value={props.email}
              placeholder="No email"
            />
          </td>
          <td>
            <Autocomplete
              multiple
              size="small"
              readOnly
              value={props.groups}
              options={[]}
              renderInput={(params) => <TextField {...params} />}
            />
          </td>
          <td>
            <ToggleSwitchView value={props.isActive === 1 ? true : false} />
          </td>
          <td>
            <button onClick={handleEdit} className="btn btn-primary btn-sm">
              Edit
            </button>
          </td>
        </tr>
      )}
    </>
  );
}

export default UserRow;
