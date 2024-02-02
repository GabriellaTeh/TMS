import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ToggleSwitchEdit from "./ToggleSwitchEdit";
import DispatchContext from "../DispatchContext";

function UserManagementEdit() {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
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

  function handleUpdatePassword(password) {}

  function handleUpdateEmail(email) {}

  function handleUpdateActive(active) {}

  function handleSave(e) {
    e.preventDefault();
    navigate("/manage");
  }

  function handleQuit() {
    setPassword("");
    setEmail("");
    navigate("/manage");
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Edit users</title>
      </Helmet>
      <div className="mt-3">
        <button onClick={handleSave} className="btn btn-danger btn-sm">
          Save changes
        </button>{" "}
        <button onClick={handleQuit} className="btn btn-success btn-sm">
          Quit without saving
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
                    <input type="text" readOnly={false} value={user.username} />
                  </td>
                  <td>
                    <div className="input-group">
                      <input
                        onChange={(e) => handleUpdatePassword(e.target.value)}
                        className="form-control"
                        type="password"
                        placeholder="password"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <input
                        onChange={(e) => handleUpdateEmail(e.target.value)}
                        className="form-control"
                        type="text"
                        defaultValue={user.email}
                      />
                    </div>
                  </td>
                  <td>
                    <input type="text" value={[]} />
                  </td>
                  <td>
                    <ToggleSwitchEdit value={user.isActive} />
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

export default UserManagementEdit;
