import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";

function UserManagementEdit() {
  const appDispatch = useContext(DispatchContext);
  function handleSave() {
    appDispatch({ type: "editDone" });
  }

  function handleQuit() {
    appDispatch({ type: "editDone" });
  }
  return (
    <>
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
        </table>
      </div>
    </>
  );
}

export default UserManagementEdit;
