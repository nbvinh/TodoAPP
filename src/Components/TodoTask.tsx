import React from "react";
import { ITask } from "../Interfaces";
import {RiCloseCircleLine} from 'react-icons/ri'
import {TiEdit} from 'react-icons/ti'

interface Props {
  task: ITask;
  completeTask(task: ITask): void;
  completeTodo(taskId : string,isComplete: boolean) : void;
  editTodo(task: ITask): void;
}

const TodoTask = ({ task, completeTask,completeTodo,editTodo }: Props) => {
  return (
    <div className={task.isComplete ? 'todo-row complete' : 'todo-row'} >
      <div className="content">
          <div key={task.id} onClick={() => {
              completeTodo(task.id, task.isComplete)
          }}>
              {task.taskName}
          </div>
        {/*<span>{task.taskName}</span>*/}
        {/*<span>{task.deadline}</span>*/}
      </div>
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    completeTask(task);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  X*/}
      {/*</button>*/}
        <div className="icons">
            <RiCloseCircleLine
                onClick={() => completeTask(task)}
                className='delete-icon'
            />
            <TiEdit
                onClick={() => editTodo(task)}
                className='edit-icon'
            />
        </div>
    </div>
  );
};

export default TodoTask;
