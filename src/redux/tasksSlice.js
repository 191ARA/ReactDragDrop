import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tasksData from '../data/tasks.json';

// Определение допустимых статусов и переходов
const STATUS_HIERARCHY = {
  'Planned': ['In Progress', 'Active'],
  'In Progress': ['Completed', 'Planned'],
  'Completed': ['In Progress', 'Ongoing'],
  'Active': ['In Progress', 'Completed'],
  'Ongoing': ['Completed']
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    // В реальном приложении здесь будет API-запрос
    return tasksData;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastUpdated: null
  },
  reducers: {
    updateTaskStatus: {
      reducer(state, action) {
        const { taskId, newStatus } = action.payload;
        const taskIndex = state.items.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
          console.error(`Task with id ${taskId} not found`);
          return;
        }

        const currentStatus = state.items[taskIndex].status;
        
        if (!STATUS_HIERARCHY[currentStatus]?.includes(newStatus)) {
          console.error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
          return;
        }

        state.items[taskIndex] = {
          ...state.items[taskIndex],
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        state.lastUpdated = new Date().toISOString();
      },
      prepare(taskId, newStatus) {
        return {
          payload: { taskId, newStatus },
          meta: {
            timestamp: new Date().toISOString(),
            isValidTransition: STATUS_HIERARCHY[newStatus] !== undefined
          }
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.map(task => ({
          ...task,
          updatedAt: new Date().toISOString()
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Селекторы
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksByProject = (projectId) => (state) => 
  state.tasks.items.filter(task => task.projectId === projectId);
export const selectTaskById = (taskId) => (state) =>
  state.tasks.items.find(task => task.id === taskId);
export const selectAllowedStatuses = (currentStatus) => 
  STATUS_HIERARCHY[currentStatus] || [];

export const { updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;