import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import TaskItem from './TaskItem';
import '../styles/TaskList.scss';

const TaskList: React.FC = () => {
  const { tasks, isLoading, filter } = useSelector((state: RootState) => state.tasks);

  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="spinner"></div>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>
          {filter === 'deleted'
            ? '🗑️ Lixeira vazia'
            : filter === 'completed'
            ? '🎉 Nenhuma tarefa concluída ainda'
            : filter === 'active'
            ? '✨ Nenhuma tarefa ativa'
            : '📝 Nenhuma tarefa criada ainda'}
        </p>
        {filter === 'all' && <p className="hint">Clique em "Nova Tarefa" para começar!</p>}
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;