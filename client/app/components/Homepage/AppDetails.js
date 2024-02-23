import React, { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";
import dayjs from "dayjs";
import EditApp from "./EditApp";
import ViewApp from "./ViewApp";

function AppDetails() {
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  const [isPL, setIsPL] = useState(false);
  const appDispatch = useContext(DispatchContext);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState(null);
  const [todo, setTodo] = useState(null);
  const [doing, setDoing] = useState(null);
  const [done, setDone] = useState(null);
  const [create, setCreate] = useState(null);
  const [groupList, setGroupList] = useState([]);
  let { name } = useParams();

  async function checkPL() {
    try {
      const group_name = "projectleader";
      const response = await Axios.post("/user/checkGroup", { group_name });
      setIsPL(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getAppDetails() {
    try {
      const response = await Axios.post("/app", { name });
      const data = response.data[0];
      setDescription(data.App_Description);
      if (data.App_startDate) {
        setStartDate(dayjs(data.App_startDate).format("YYYY-MM-DD"));
      } else {
        setStartDate(null);
      }
      if (data.App_endDate) {
        setEndDate(dayjs(data.App_endDate).format("YYYY-MM-DD"));
      } else {
        setEndDate(null);
      }
      if (data.App_permit_Create) {
        setCreate(data.App_permit_Create);
      }
      if (data.App_permit_Doing) {
        setDoing(data.App_permit_Doing);
      }
      if (data.App_permit_Done) {
        setDone(data.App_permit_Done);
      }
      if (data.App_permit_toDoList) {
        setTodo(data.App_permit_toDoList);
      }
      if (data.App_permit_Open) {
        setOpen(data.App_permit_Open);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getGroupList() {
    setGroupList([]);
    try {
      const response = await Axios.get("/groups");
      if (response.data) {
        const options = [];
        response.data.forEach((group) => {
          options.push(group.name);
        });
        setGroupList(options);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!appState.loggedIn) {
      appDispatch({ type: "logout" });
      appDispatch({ type: "errorMessage", value: "Please log in." });
      navigate("/");
    } else {
      checkPL();
      getAppDetails();
      getGroupList();
    }
  }, []);

  return (
    <>
      <div className="container md-5">
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <h4>{name}</h4>
        {isPL ? (
          <EditApp
            description={description}
            startDate={startDate}
            endDate={endDate}
            create={create}
            doing={doing}
            done={done}
            todo={todo}
            open={open}
            groupList={groupList}
          />
        ) : (
          <ViewApp
            description={description}
            startDate={startDate}
            endDate={endDate}
            create={create}
            doing={doing}
            done={done}
            todo={todo}
            open={open}
          />
        )}
      </div>
    </>
  );
}

export default AppDetails;
