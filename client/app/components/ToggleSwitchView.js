import React, { useState } from "react";
import ReactSwitch from "react-switch";

function ToggleSwitchView(props) {
  return (
    <>
      <ReactSwitch checked={props.value} checkedIcon={true} disabled={true} />
    </>
  );
}

export default ToggleSwitchView;
