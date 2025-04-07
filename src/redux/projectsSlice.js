import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectsData from '../data/projects.json';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    // В реальном приложении здесь был бы API-запрос
    return projectsData;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedProject: null,
  },
  reducers: {
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectProject, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;