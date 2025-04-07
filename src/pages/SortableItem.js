import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, task, status, getStatusColor, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'task',
      status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `4px solid ${getStatusColor(status)}`,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <h4>{task.title}</h4>
      <div className="task-meta">
        <span className="task-id">#{task.id}</span>
        <span className="task-status-badge" 
          style={{ backgroundColor: getStatusColor(status) }} >
          {t(status.toLowerCase())}
        </span>
      </div>
    </div>
  );
};