import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../../StateContext";
import { Helmet } from "react-helmet";
import DispatchContext from "../../DispatchContext";
import CreateUser from "./CreateUser";
import CreateGroup from "./CreateGroup";
import Axios from "axios";
import UserRow from "./UserRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";

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
          options.push(group.name);
        });
        setGroupList(options);
      }
    } catch (err) {
      console.log(err);
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
            userOptions.push(group);
          });
          options.push({ user: user.username, groups: userOptions });
        });
        setGroups(options);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function findGroups(userId) {
    const group = groups.find((group) => group.user === userId);
    if (group) {
      return group.groups;
    }
  }

  async function verifyToken(refresh) {
    try {
      const response = await Axios.get("/verify");
      if (!response.data) {
        appDispatch({ type: "errorMessage", value: "Token invalid." });
        appDispatch({ type: "logout" });
        navigate("/");
      } else {
        checkActive(refresh);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function checkActive(refresh) {
    try {
      const response = await Axios.get("/checkActive");
      if (!response.data) {
        navigate("/");
        appDispatch({ type: "errorMessage", value: "Inactive." });
      } else {
        checkAdmin(refresh);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function checkAdmin() {
    const group_name = "admin";
    try {
      const response = await Axios.post("/user/checkGroup", { group_name });
      if (!response.data) {
        navigate("/home");
      } else {
        getGroupsList();
        getUsersTable();
        setRefresh(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    } else {
      verifyToken();
    }
  }, [refresh]);

  return (
    <>
      <Helmet>
        <title>Manage Users</title>
      </Helmet>
      <CreateGroup setRefresh={setRefresh} />
      <CreateUser groupList={groupList} setRefresh={setRefresh} />
      <div className="mt-3">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Password</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Groups</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="center"></TableCell>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                return (
                  <UserRow
                    username={user.username}
                    email={user.email}
                    isActive={user.isActive}
                    groups={findGroups(user.username)}
                    groupList={groupList}
                    setRefresh={setRefresh}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default UserManagement;
