import React, { useEffect, useContext, useState } from "react";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function UserManagementView() {
  const appDispatch = useContext(DispatchContext);
  const [users, setUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

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

  async function getUserGroups() {
    try {
      const response = await Axios.get("/group/user");
      console.log(response.data);

      if (response.data) {
        setUserGroups(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleEdit() {
    appDispatch({ type: "editing" });
  }

  useEffect(() => {
    getUsers();
    getUserGroups();
  }, []);

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
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.username}>
                  <td>
                    <input type="text" readOnly={true} value={user.username} />
                  </td>
                  <td>
                    <input
                      type="password"
                      readOnly={true}
                      value={user.password}
                    />
                  </td>
                  <td>
                    <input type="text" readOnly={true} value={user.email} />
                  </td>
                  <td>
                    <input type="text" readOnly={true} value={"group"} />
                  </td>
                  <td>
                    <input
                      type="text"
                      readOnly={true}
                      value={user.isActive === 1 ? true : false}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserManagementView;
