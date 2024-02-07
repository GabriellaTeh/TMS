import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../DispatchContext";
import CreateUser from "./CreateUser";
import CreateGroup from "./CreateGroup";
import Axios from "axios";
import UserRow from "./UserRow";

function UserManagement() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [refresh, setRefresh] = useState(true);

  async function getGroupsList() {
    setGroupList([]);
    try {
      const response = await Axios.get("/groups");
      if (response.data) {
        const options = [];
        response.data.forEach((group) => {
          options.push({
            value: group.name,
            label: group.name,
          });
        });
        setGroupList(options);
      }
    } catch (err) {
      console.log(err);
      appDispatch({ type: "errorFlashMessage", value: "Token invalid" });
      navigate("/");
    }
  }

  async function getUsersTable() {
    setUsers([]);
    setGroups([]);
    try {
      const response = await Axios.get("/users");
      if (response.data) {
        setUsers(response.data);
        const options = [];
        response.data.forEach((user) => {
          const userGroups = user.groupNames.split(",");
          userGroups.pop();
          const userOptions = [];
          userGroups.forEach((group) => {
            userOptions.push({
              value: group,
              label: group,
            });
          });
          options.push({ user: user.id, groups: userOptions });
        });
        setGroups(options);
      }
    } catch (err) {
      console.log(err);
      appDispatch({ type: "errorFlashMessage", value: "Token invalid" });
      navigate("/");
    }
  }

  function findGroups(userId) {
    const group = groups.find((group) => group.user === userId);
    if (group) {
      return group.groups;
    }
  }

  async function checkAdmin() {
    const group_name = "admin";
    try {
      const response = await Axios.post("/user/checkGroup", { group_name });
      if (!response.data) {
        navigate("/home");
      }
    } catch (err) {
      appDispatch({ type: "errorFlashMessage", value: "Token invalid" });
      navigate("/");
    }
  }

  useEffect(() => {
    if (refresh) {
      getGroupsList();
      getUsersTable();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorFlashMessage", value: "Please log in" });
      navigate("/");
    } else {
      checkAdmin();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Users</title>
      </Helmet>
      <CreateGroup setRefresh={setRefresh} />
      <CreateUser groupList={groupList} setRefresh={setRefresh} />
      <div className="mt-3">
        <table id="userTable" className="table table-hover">
          <thead>
            <tr>
              <th className="col-2" scope="col">
                Username
              </th>
              <th className="col-2" scope="col">
                Password
              </th>
              <th className="col-2" scope="col">
                Email
              </th>
              <th className="col-auto" scope="col">
                Groups
              </th>
              <th className="col-auto" scope="col">
                Active
              </th>
              <th className="col-auto" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <UserRow
                  id={user.id}
                  username={user.username}
                  email={user.email}
                  isActive={user.isActive}
                  groups={findGroups(user.id)}
                  groupList={groupList}
                  setRefresh={setRefresh}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserManagement;
