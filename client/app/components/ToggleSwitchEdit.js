import React, { useState } from "react";
import ReactSwitch from "react-switch";
import Axios from "axios";

function ToggleSwitchEdit(props) {
  const [checked, setChecked] = useState(props.value);

  function handleChange(val) {
    setChecked(val);
    props.setIsActive(val);
  }
  return (
    <>
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        checkedIcon={true}
      />
    </>
  );
}

export default ToggleSwitchEdit;
