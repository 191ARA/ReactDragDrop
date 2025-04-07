import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, selectProject, clearSelectedProject } from '../redux/projectsSlice';
import { fetchTasks, updateTaskStatus } from '../redux/tasksSlice';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import './Dashboard.css';

const statusOrder = {
  'Planned': 0,
  'In Progress': 1,
  'Completed': 2,
  'Active': 3,
  'Ongoing': 4
};

// Функция для сохранения задач в localStorage
const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Функция для загрузки задач из localStorage
const loadTasksFromStorage = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const { items: projects, selectedProject } = useSelector(state => state.projects);
  const { items: allTasks } = useSelector(state => state.tasks);
  
  const [activeId, setActiveId] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [localTasks, setLocalTasks] = useState([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(fetchProjects());
    
    // Проверяем есть ли задачи в localStorage
    const storedTasks = loadTasksFromStorage();
    if (storedTasks) {
      setLocalTasks(storedTasks);
    } else {
      dispatch(fetchTasks());
    }
  }, [dispatch]);

  // Синхронизация с Redux store
  useEffect(() => {
    if (allTasks.length > 0 && localTasks.length === 0) {
      setLocalTasks(allTasks);
      saveTasksToStorage(allTasks);
    }
  }, [allTasks, localTasks]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const projectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return localTasks.filter(task => task.projectId === selectedProject.id);
  }, [localTasks, selectedProject]);

  const tasksByStatus = useMemo(() => {
    const statusGroups = {
      'Planned': [],
      'In Progress': [],
      'Completed': [],
      'Active': [],
      'Ongoing': []
    };
    
    projectTasks.forEach(task => {
      if (statusGroups[task.status]) {
        statusGroups[task.status].push(task);
      }
    });
    
    return Object.entries(statusGroups)
      .sort(([statusA], [statusB]) => statusOrder[statusA] - statusOrder[statusB])
      .reduce((acc, [status, tasks]) => {
        acc[status] = tasks;
        return acc;
      }, {});
  }, [projectTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveStatus(active.data.current?.status);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveStatus(null);
      return;
    }

    const oldStatus = active.data.current?.status;
    const newStatus = over.data.current?.status || oldStatus;
    const taskId = parseInt(active.id);

    if (oldStatus !== newStatus) {
      // Обновляем локальное состояние
      const updatedTasks = localTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      setLocalTasks(updatedTasks);
      saveTasksToStorage(updatedTasks); // Сохраняем в localStorage
      
      // Отправляем изменение в Redux (если нужно сохранять на сервере)
      dispatch(updateTaskStatus({
        taskId,
        newStatus
      }));
    }

    setActiveId(null);
    setActiveStatus(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planned': '#94a3b8',
      'In Progress': '#f59e0b',
      'Completed': '#10b981',
      'Active': '#3b82f6',
      'Ongoing': '#8b5cf6'
    };
    return colors[status] || '#64748b';
  };

  const getActiveTask = () => {
    if (!activeId || !activeStatus) return null;
    return projectTasks.find(task => task.id.toString() === activeId);
  };

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
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
            <span className="btn-text">{t('logout')}</span>
            <span className="btn-icon">↩</span>
          </button>
        </div>
        
        <div className="projects-section">
          <h2>{t('yourProjects')}</h2>
          <div className="projects-grid">
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => dispatch(selectProject(project))}
              >
                <h3>{project.name}</h3>
                <p className="project-status">{project.status}</p>
                <p className="project-description">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {selectedProject && (
          <div className="project-modal">
            <div className="modal-content">
              <button 
                className="close-modal"
                onClick={() => dispatch(clearSelectedProject())}
              >
                ×
              </button>
              
              <h2>{selectedProject.name}</h2>
              <p className="project-description">{selectedProject.description}</p>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="kanban-board">
                  {Object.entries(tasksByStatus).map(([status, tasks]) => (
                    <div key={status} className="kanban-column">
                      <div className="column-header" style={{ borderColor: getStatusColor(status) }}>
                        <h3>{t(status.toLowerCase())}</h3>
                        <span className="task-count">{tasks.length}</span>
                      </div>
                      <SortableContext
                        items={tasks.map(task => task.id.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="tasks-list">
                          {tasks.map(task => (
                            <SortableItem
                              key={task.id}
                              id={task.id.toString()}
                              task={task}
                              status={status}
                              getStatusColor={getStatusColor}
                              t={t}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  ))}
                </div>
                <DragOverlay dropAnimation={dropAnimationConfig}>
                  {activeId ? (
                    <div className="task-card dragging-overlay"
                      style={{
                        borderLeft: `4px solid ${getStatusColor(activeStatus)}`
                      }}
                    >
                      <h4>{getActiveTask()?.title}</h4>
                      <div className="task-meta">
                        <span className="task-id">#{getActiveTask()?.id}</span>
                        <span className="task-status-badge" 
                          style={{ backgroundColor: getStatusColor(activeStatus) }} >
                          {t(activeStatus?.toLowerCase())}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;