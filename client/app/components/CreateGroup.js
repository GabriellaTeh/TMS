import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function CreateGroup() {
  const [group, setGroup] = useState("");
  const appDispatch = useContext(DispatchContext);

  async function handleCreateGroup(e) {
    e.preventDefault();
    try {
      if (group) {
        const response = await Axios.post("/group/createGroup", { group });
        if (response.data === "Group Length") {
          appDispatch({
            type: "errorFlashMessage",
            value:
              "Group name must be minimum 3 characters and maximum 20 characters",
          });
        } else if (response.data === "Group Character") {
          appDispatch({
            type: "errorFlashMessage",
            value: "Group name can only contain alphanumeric characters",
          });
        } else if (response.data === "Group exists") {
          appDispatch({ type: "errorFlashMessage", value: "Group exists" });
        } else if (response.data) {
          appDispatch({
            type: "successFlashMessage",
            value: "Group created!",
          });
          e.target.reset();
        } else {
          appDispatch({ type: "errorFlashMessage", value: "Error" });
        }
      } else {
        appDispatch({
          type: "errorFlashMessage",
          value: "Please enter group name!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <form onSubmit={handleCreateGroup}>
        <div className="row container align-items-center">
          <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input
              onChange={(e) => setGroup(e.target.value)}
              className="form-control form-control-sm"
              type="text"
              placeholder="Group"
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
