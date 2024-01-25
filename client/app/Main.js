import React from "react";
import ReactDOM from "react-dom/client";

import Header from "./components/Header";
import Login from "./components/Login";

function Main() {
  return (
    <>
      <Header />
      <Login />
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
