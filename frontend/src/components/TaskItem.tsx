import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateTask, deleteTask, restoreTask } from '../store/slices/tasksSlice';
import { Task } from '../store/slices/tasksSlice';
import TaskForm from './TaskForm';
import '../styles/TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filter } = useSelector((state: RootState) => state.tasks);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleComplete = () => {
    dispatch(updateTask({ id: task._id, updates: { completed: !task.completed } }));
  };

  const handleDelete = () => {
    if (task.deleted) {
      setShowConfirm(true);
    } else {
      dispatch(deleteTask({ id: task._id }));
    }
  };

  const handlePermanentDelete = () => {
    dispatch(deleteTask({ id: task._id, permanent: true }));
    setShowConfirm(false);
  };

  const handleRestore = () => {
    dispatch(restoreTask(task._id));
  };

  const handleUpdate = (updates: Partial<Task>) => {
    dispatch(updateTask({ id: task._id, updates }));
    setIsEditing(false);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#1e90ff';
      default: return '#95a5a6';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
      />
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${task.deleted ? 'deleted' : ''}`}>
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Tem certeza que deseja deletar permanentemente?</p>
          <div className="confirm-buttons">
            <button onClick={handlePermanentDelete} className="btn-danger">
              Sim, deletar
            </button>
            <button onClick={() => setShowConfirm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="task-header">
        {!task.deleted && (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="task-checkbox"
          />
        )}
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            <span className="priority" style={{ backgroundColor: getPriorityColor() }}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="due-date">📅 {formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {task.deleted ? (
          <>
            <button onClick={handleRestore} className="btn-icon" title="Restaurar">
              ↶
            </button>
            <button onClick={handleDelete} className="btn-icon btn-danger" title="Deletar permanentemente">
              🗑️
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-icon" title="Editar">
              ✏️
            </button>
            <button onClick={handleDelete} className="btn-icon btn-danger" title="Mover para lixeira">
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;