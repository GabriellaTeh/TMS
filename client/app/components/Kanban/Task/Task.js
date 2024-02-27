import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";
import OpenTask from "./OpenTask";
import TodoTask from "./TodoTask";
import DoingTask from "./DoingTask";
import DoneTask from "./DoneTask";
import ClosedTask from "./ClosedTask";

function Task() {
  let { task } = useParams();
  const [taskName, setTaskName] = useState();
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState();
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [state, setState] = useState();
  const [creator, setCreator] = useState();
  const [owner, setOwner] = useState();
  const [createDate, setCreateDate] = useState();

  async function getTaskDetails() {
    try {
      const response = await Axios.post("/task", { task });
      const data = response.data[0];
      setTaskName(data.Task_name);
      setDescription(data.Task_description);
      setNotes(data.Task_notes);
      setPlan(data.Task_plan);
      setState(data.Task_state);
      setCreator(data.Task_creator);
      setCreateDate(data.Task_createDate);
      setOwner(data.Task_owner);
      const name = data.Task_app_Acronym;
      try {
        const response = await Axios.post("/plan/list", { name });
        const list = [];
        response.data.forEach((plan) => {
          list.push(plan.Plan_MVP_name);
        });
        setPlans(list);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTaskDetails();
  }, []);

  return (
    <>
      <div className="container md-5">
        {state === "open" ? (
          <OpenTask
            description={description}
            notes={notes}
            plan={plan}
            plans={plans}
            taskName={taskName}
            creator={creator}
            createDate={createDate}
            owner={owner}
          />
        ) : (
          ""
        )}
        {state === "todo" ? (
          <TodoTask
            description={description}
            notes={notes}
            plan={plan}
            plans={plans}
            taskName={taskName}
            creator={creator}
            createDate={createDate}
            owner={owner}
          />
        ) : (
          ""
        )}
        {state === "doing" ? (
          <DoingTask
            description={description}
            notes={notes}
            plan={plan}
            plans={plans}
            taskName={taskName}
            creator={creator}
            createDate={createDate}
            owner={owner}
          />
        ) : (
          ""
        )}
        {state === "done" ? (
          <DoneTask
            description={description}
            notes={notes}
            plan={plan}
            plans={plans}
          />
        ) : (
          ""
        )}
        {state === "closed" ? (
          <ClosedTask
            description={description}
            notes={notes}
            plan={plan}
            plans={plans}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Task;
