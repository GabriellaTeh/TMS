import React, { useEffect, useState } from "react";
import Select from "react-select";
import ToggleSwitchView from "./ToggleSwitchView";
import UserRowEdit from "./UserRowEdit";

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
          id={props.id}
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
        <tr key={props.id}>
          <td>
            <input type="text" readOnly={true} value={props.username} />
          </td>
          <td>
            <input type="password" readOnly={true} value="......." />
          </td>
          <td>
            <input type="text" readOnly={true} value={props.email} />
          </td>
          <td>
            <Select
              isMulti
              isDisabled
              placeholder="No groups"
              defaultValue={props.groups}
              options={props.groupList}
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
