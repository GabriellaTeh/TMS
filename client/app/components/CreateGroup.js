import React, { useContext, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";

function CreateGroup(props) {
  const [group, setGroup] = useState("");
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  async function handleCreateGroup(e) {
    e.preventDefault();
    try {
      if (group) {
        const response = await Axios.post("/group/createGroup", { group });
        if (response.data === "Inactive") {
          navigate("/");
          appDispatch({ type: "errorMessage", value: "Inactive." });
        } else if (response.data === "Jwt") {
          appDispatch({ type: "errorMessage", value: "Token invalid." });
          appDispatch({ type: "logout" });
          navigate("/");
        } else if (response.data === "Unauthorized") {
          appDispatch({ type: "errorMessage", value: "Not authorized." });
          navigate("/home");
          appState.authChange = true;
        } else {
          const data = response.data.split(" ");
          data.pop();
          if (data.length > 0) {
            if (data.includes("GroupLength")) {
              appDispatch({
                type: "errorMessage",
                value:
                  "Group name must be at least 3 characters and at most 20 characters long.",
              });
            }
            if (data.includes("GroupCharacter")) {
              appDispatch({
                type: "errorMessage",
                value: "Group name can only contain alphanumeric characters.",
              });
            }
            if (data.includes("GroupExists")) {
              appDispatch({
                type: "errorMessage",
                value: "Group already exists.",
              });
            }
          } else {
            appDispatch({
              type: "successMessage",
              value: "Group created.",
            });
            props.setRefresh(true);
            e.target.reset();
          }
        }
      } else {
        appDispatch({
          type: "errorMessage",
          value: "Please enter group name.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <form onSubmit={handleCreateGroup}>
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input
              style={{ width: "200px", float: "right" }}
              onChange={(e) => setGroup(e.target.value)}
              className="form-control form-control-sm"
              type="text"
              placeholder="Group Name"
            />
          </div>
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Create Group</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateGroup;
