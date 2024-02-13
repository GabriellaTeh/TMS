import React, { useState } from "react";
import { Switch } from "@mui/material";

function ToggleSwitchEdit(props) {
  const [checked, setChecked] = useState(props.value);

  function handleChange(event) {
    setChecked(event.target.checked);
    props.setIsActive(event.target.checked);
    props.setActiveChanged(true);
  }
  return (
    <>
      <Switch checked={checked} onChange={handleChange} color="success" />
    </>
  );
}

export default ToggleSwitchEdit;
