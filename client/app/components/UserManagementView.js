import React, { useEffect, useContext, useState } from "react";
import DispatchContext from "../DispatchContext";

function UserManagementView() {
  const appDispatch = useContext(DispatchContext);
  const [users, setUsers] = useState([]);

  async function getUsers() {
    try {
      const response = await Axios.get("/users");

      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleEdit() {
    appDispatch({ type: "editing" });
  }
  return (
    <>
      <div className="mt-3">
        <button onClick={handleEdit} className="btn btn-primary btn-sm">
          Edit Mode
        </button>
      </div>
      <div className="mt-3">
        <table id="userTable" className="table table-hover">
          <thead>
            <tr>
              <th className="col-2" scope="col">
                Username
              </th>
              <th className="col-2" scope="col" data-editable="true">
                Password
              </th>
              <th className="col-2" scope="col">
                Email
              </th>
              <th className="col-auto" scope="col">
                Groups
              </th>
              <th className="col-sm-2" scope="col">
                Active
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
}

export default UserManagementView;
