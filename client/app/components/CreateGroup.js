import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

function CreateGroup(props) {
  const [groups, setGroups] = useState();
  function handleCreateGroup() {
    //if in props.groupList show error message
    //validate group else show error
  }

  return (
    <>
      <form onSubmit={handleCreateGroup}>
        <div className="row container align-items-center">
          <CreatableSelect
            isMulti
            placeholder="Groups"
            onChange={(newValue) => setGroups(newValue)}
          />
          <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Create Group</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateGroup;
