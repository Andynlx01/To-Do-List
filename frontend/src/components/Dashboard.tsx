import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { fetchTasks, setFilter, createTask } from '../store/slices/tasksSlice';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import '../styles/Dashboard.scss';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { filter, tasks } = useSelector((state: RootState) => state.tasks);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(filter));
  }, [dispatch, filter]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed' | 'deleted') => {
    dispatch(setFilter(newFilter));
  };

  const stats = {
    total: tasks.filter(t => !t.deleted).length,
    active: tasks.filter(t => !t.completed && !t.deleted).length,
    completed: tasks.filter(t => t.completed && !t.deleted).length,
    deleted: tasks.filter(t => t.deleted).length,
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📝 Minhas Tarefas</h1>
          <div className="user-info">
            <span>Olá, {user?.name}!</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Ativas</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Concluídas</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.deleted}</span>
            <span className="stat-label">Lixeira</span>
          </div>
        </div>

        <div className="controls">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => handleFilterChange('all')}
            >
              Todas
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => handleFilterChange('active')}
            >
              Ativas
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => handleFilterChange('completed')}
            >
              Concluídas
            </button>
            <button
              className={filter === 'deleted' ? 'active' : ''}
              onClick={() => handleFilterChange('deleted')}
            >
              Lixeira
            </button>
          </div>

          <button className="btn-add-task" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancelar' : '+ Nova Tarefa'}
          </button>
        </div>

        {showForm && (
          <TaskForm
            onClose={() => setShowForm(false)}
            onSubmit={(taskData) => {
              dispatch(createTask(taskData));
              setShowForm(false);
            }}
          />
        )}

        <TaskList />
      </div>
    </div>
  );
};

export default Dashboard;