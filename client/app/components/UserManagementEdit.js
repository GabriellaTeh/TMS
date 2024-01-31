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
    </>
  );
}

export default UserManagementEdit;
