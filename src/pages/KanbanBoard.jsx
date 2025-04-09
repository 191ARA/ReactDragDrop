import React, { useMemo, useReducer, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import projectsData from '../data/projects.json';
import tasksData from '../data/tasks.json';
import './KanbanBoard.css';

const statuses = ['Planned', 'Active', 'In Progress', 'Ongoing', 'Completed'];

const initialFormState = {
  title: '',
  status: 'Planned',
  projectId: ''
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  useEffect(() => {
    setTasks(tasksData);
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(p => ['Active', 'Ongoing', 'Planned'].includes(p.status));
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: tasks.length + 1,
      ...formState
    };
    setTasks([...tasks, newTask]);
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="kanban-container">
      <h2>Канбан-доска проектов</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          placeholder="Название задачи"
          value={formState.title}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
          required
        />
        <select
          value={formState.projectId}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'projectId', value: Number(e.target.value) })}
          required
        >
          <option value="">Выберите проект</option>
          {filteredProjects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          value={formState.status}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'status', value: e.target.value })}
        >
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit">Создать задачу</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statuses.map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3>{status}</h3>
                  {tasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided) => (
                          <div
                            className="kanban-task"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <strong>{task.title}</strong>
                            <p>
                              {
                                projectsData.find(p => p.id === task.projectId)?.name
                              }
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
