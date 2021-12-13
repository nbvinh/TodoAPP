import React, {FC, ChangeEvent, useState, useEffect} from "react";
import "./App.css";
import TodoTask from "./Components/TodoTask";
import { ITask } from "./Interfaces";
import axios from "axios";

const URI = 'https://61b6e4ecc95dd70017d410ba.mockapi.io/api/v1/tasks'
const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [deadline, setDealine] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);
  const [edit, setEdit] = useState<ITask|null>(null);

  useEffect(()=>{
    getTask()
  },[])
  const getTask = ()=>{
    axios(URI,{
      method: "GET"
    })
        .then((res)=>setTodoList(res.data))
        .catch((error)=>{
          alert(error.response.data)
        })
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "task") {
      setTask(event.target.value);
    } else {
      setDealine(Number(event.target.value));
    }
  };

  const addTask = (): void => {
    const newTask = { taskName: task, deadline: deadline, id: String(Math.random()) };
    axios(URI,{
      method: "POST",
      data: newTask
    }).then((response => {
        setTodoList([...todoList, response.data]);
        setTask("");
        setDealine(0);
    })
    ).catch((error)=>{
      alert(error.response.data)
    })
  };

  const completeTask = (taskToDelete: ITask): void => {
    axios(URI+`/${taskToDelete.id}`,{
      method:'DELETE'
    }).then((response)=>{
        setTodoList(
          todoList.filter((task) => {
            return task.taskName != taskToDelete.taskName;
          })
        );
    })
        .catch((error)=>{
          alert(error.response.data)
        })
  };

  const completeTodo =(taskId: string, isComplete: boolean)=>{
      axios(URI+`/${taskId}`,{
          method: "PUT",
          data: {
              isComplete : !isComplete
          }
      }).then((response)=> {
          const value = todoList.map(item=>{
              if(item.id === response.data.id){
                  return {...item,isComplete : response.data.isComplete}
              }
              else {
                  return item
              }
          })
          setTodoList(value)
      }).catch((error)=> {
          alert(error.response.data)
      })
  }
  const editTodo =(task:ITask) =>{
    setEdit(task)
      setTask(task.taskName)
  }

  const onUpdate =()=>{
      axios(URI+`/${edit?.id}`,{
          method: "PUT",
          data: {
              taskName: task
          }
      }).then((response)=> {
          const value = todoList.map(item=>{
              if(item.id === response.data.id){
                  return {...item,taskName : response.data.taskName}
              }
              else {
                 return item
              }
          })
          setTodoList(value)
          setEdit(null)
          setTask('')
      })

  }
  return (
    <div className="todo-app">
      <div>
        <h1>What's the Plan for Today?</h1>
        <div className='todo-form'>
            {
                edit ?
                    <>
                        <input
                            type="text"
                            placeholder="Update your item"
                            value={task}
                            name="task"
                            className="todo-input edit"
                            onChange={handleChange}
                        />
                        <button className="todo-button edit" onClick={onUpdate}>Update</button>
                    </>
                    :

                    <>
                        <input
                            type="text"
                            placeholder="Task..."
                            name="task"
                            value={task}
                            className="todo-input"
                            onChange={handleChange}
                        />
                        <button className='todo-button' onClick={addTask}>Add Task</button>
                    </>
            }
        </div>
      </div>
      <div className="todoList">
        {
            !edit &&
            todoList.map((task: ITask, key: number) => {
          return <TodoTask key={task.id} task={task} editTodo={editTodo} completeTask={completeTask} completeTodo={completeTodo} />;
        })}
      </div>
    </div>
  );
};

export default App;
