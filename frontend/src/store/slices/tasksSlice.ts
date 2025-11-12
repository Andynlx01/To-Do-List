import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

const API_URL = 'http://localhost:5000/api';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed' | 'deleted';
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  filter: 'all',
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filter: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.get(`${API_URL}/tasks?filter=${filter}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao buscar tarefas');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao criar tarefa');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.put(`${API_URL}/tasks/${id}`, updates, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao atualizar tarefa');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ id, permanent }: { id: string; permanent?: boolean }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      await axios.delete(`${API_URL}/tasks/${id}?permanent=${permanent || false}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      });
      return { id, permanent };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao deletar tarefa');
    }
  }
);

export const restoreTask = createAsyncThunk(
  'tasks/restoreTask',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const response = await axios.put(`${API_URL}/tasks/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${state.auth.token}` }
      });
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Erro ao restaurar tarefa');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      });

    // Update Task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });

    // Delete Task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (action.payload.permanent) {
          state.tasks = state.tasks.filter(task => task._id !== action.payload.id);
        } else {
          const task = state.tasks.find(t => t._id === action.payload.id);
          if (task) task.deleted = true;
        }
      });

    // Restore Task
    builder
      .addCase(restoreTask.fulfilled, (state, action) => {
        const task = state.tasks.find(t => t._id === action.payload._id);
        if (task) {
          task.deleted = false;
        }
      });
  },
});

export const { setFilter, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;