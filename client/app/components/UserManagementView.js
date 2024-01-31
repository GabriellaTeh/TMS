import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";

function UserManagementView() {
  const appDispatch = useContext(DispatchContext);
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
    </>
  );
}

export default UserManagementView;
