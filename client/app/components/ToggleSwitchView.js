import React, { useState } from "react";
import ReactSwitch from "react-switch";

function ToggleSwitchView(props) {
  const [checked, setChecked] = useState(props.value);

  function handleChange(val) {
    setChecked(val);
  }
  return (
    <>
      <ReactSwitch
        checked={checked}
        onChange={handleChange}
        checkedIcon={true}
        disabled={true}
      />
    </>
  );
}

export default ToggleSwitchView;
