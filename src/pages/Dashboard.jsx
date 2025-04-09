import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import projectsData from '../data/projects.json';
import tasksData from '../data/tasks.json';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Dashboard.css';

const possibleStatuses = ['Planned', 'Active', 'In Progress', 'Ongoing', 'Completed'];

const Dashboard = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState(tasksData);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate(); 

  const user = JSON.parse(localStorage.getItem('user'));

  const projects = useMemo(() => projectsData, []);
  const projectTasks = useMemo(() => 
    tasks.filter(task => task.projectId === selectedProject?.id), 
    [tasks, selectedProject]
  );

  const tasksByStatus = useMemo(() => {
    const grouped = {};
    possibleStatuses.forEach(status => {
      grouped[status] = projectTasks.filter(task => task.status === status);
    });
    return grouped;
  }, [projectTasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination || 
        destination.droppableId === source.droppableId ||
        !selectedProject) {
      return;
    }

    setTasks(tasks.map(task => 
      task.id === +draggableId 
        ? { ...task, status: destination.droppableId }
        : task
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="dashboard-content">
        <div className="user-panel">
          <div className="user-header">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{t('welcome')}, <span className="user-name">{user.name}</span>!</h1>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            {t('logout')} ↩
          </button>
        </div>

        <div className="projects-section">
          <h2>{t('projects')}</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <div 
                key={project.id}
                className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <h3>{project.name}</h3>
                <div className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </div>
                <p className="project-description">{project.description}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedProject && (
          <div className="project-modal">
            <div className={`modal-content ${theme}`}>
              <button 
                className="close-modal"
                onClick={() => setSelectedProject(null)}
              >
                &times;
              </button>

              <div className="modal-header">
                <h2>{selectedProject.name}</h2>
                <p className="project-description">{selectedProject.description}</p>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                  {possibleStatuses.map(status => (
                    <div key={status} className="kanban-column">
                      <div className="column-header">
                        <h3>{status}</h3>
                        <div className="task-count">{tasksByStatus[status].length}</div>
                      </div>
                      <Droppable droppableId={status}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`tasks-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                          >
                            {tasksByStatus[status].map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={String(task.id)}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                  >
                                    <h4>{task.title}</h4>
                                    <div className="task-meta">
                                      <span>#{task.id}</span>
                                      <span className={`task-status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                                        {status}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;