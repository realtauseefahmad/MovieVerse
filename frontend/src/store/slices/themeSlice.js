import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: typeof localStorage !== 'undefined' ? (localStorage.getItem('theme') || 'dark') : 'dark',
  },
  reducers: {
    setTheme: (state, { payload }) => {
      state.mode = payload === 'light' ? 'light' : 'dark';
      if (typeof localStorage !== 'undefined') localStorage.setItem('theme', state.mode);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      if (typeof localStorage !== 'undefined') localStorage.setItem('theme', state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
