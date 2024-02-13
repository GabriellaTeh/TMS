import React from "react";
import { Switch } from "@mui/material";

function ToggleSwitchView(props) {
  return (
    <>
      <Switch checked={props.value} disabled color="success" />
    </>
  );
}

export default ToggleSwitchView;
