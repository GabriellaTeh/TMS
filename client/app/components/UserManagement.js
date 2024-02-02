import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../DispatchContext";
import CreateUser from "./CreateUser";
import Axios from "axios";
import Select from "react-select";
import ToggleSwitchView from "./ToggleSwitchView";

function UserManagement() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

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

  async function getAllGroups() {
    try {
      const response = await Axios.get("/groups");
      const processedData = [];
      response.data.forEach((group) => {
        const existingUser = processedData.find(
          (user) => user.userId === group.userId
        );

        if (existingUser) {
          existingUser.group_name.push(group.group_name);
        } else {
          processedData.push({
            userId: group.userId,
            group_name: [group.group_name],
          });
        }
      });

      const for_options = [];
      processedData.forEach((user) => {
        const options = [];
        user.group_name.forEach((group) => {
          options.push({
            value: group,
            label: group,
          });
        });
        for_options.push({ userId: user.userId, groupNames: options });
      });
      setGroups(for_options);
    } catch (err) {
      console.log(err);
    }
  }

  function getUserGroups(id) {
    groups.forEach((user) => {
      if (user.userId == id) {
        return user.groupNames;
      }
    });
  }

  function handleEdit() {
    setEdit(true);
  }

  useEffect(() => {
    getUsers();
    getAllGroups();
  }, []);

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorFlashMessage", value: "Please log in" });
      navigate("/");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Users</title>
      </Helmet>
      <CreateUser />
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
                <tr key={user.id}>
                  <td>
                    <input type="text" readOnly={true} value={user.username} />
                  </td>
                  <td>
                    <input type="password" readOnly={true} value="......." />
                  </td>
                  <td>
                    <input type="text" readOnly={true} value={user.email} />
                  </td>
                  <td>
                    <Select
                      isMulti
                      placeholder="No groups"
                      defaultValue={getUserGroups(user.id)}
                    />
                  </td>
                  <td>
                    <ToggleSwitchView
                      value={user.isActive === 1 ? true : false}
                    />
                  </td>
                  <td>
                    <button
                      onClick={handleEdit}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </button>
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

export default UserManagement;
