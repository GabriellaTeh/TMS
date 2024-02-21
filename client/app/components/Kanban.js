import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

function Kanban() {
  let { name } = useParams();
  return (
    <>
      <div className="container md-5">
        <Helmet>
          <title>{name} Tasks</title>
        </Helmet>
        <h4>{name}</h4>
      </div>
    </>
  );
}

export default Kanban;
