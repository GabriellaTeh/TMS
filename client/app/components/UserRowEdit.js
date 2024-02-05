import React, { useEffect, useState } from "react";
import Select from "react-select";
import ToggleSwitchEdit from "./ToggleSwitchEdit";

function UserRowEdit(props) {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  return (
    <>
      <tr key={props.id}>
        <td>
          <input type="text" readOnly={true} value={props.username} />
        </td>
        <td>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </td>
        <td>
          <input
            type="text"
            value={props.email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </td>
        <td>
          <Select
            isMulti
            placeholder="No groups"
            options={props.groups}
            defaultValue={props.groups}
          />
        </td>
        <td>
          <ToggleSwitchEdit value={props.isActive === 1 ? true : false} />
        </td>
        <td>
          <button
            onClick={() => props.setEdit(false)}
            className="btn btn-primary btn-sm"
          >
            Save
          </button>
        </td>
      </tr>
    </>
  );
}

export default UserRowEdit;
