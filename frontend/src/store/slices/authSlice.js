import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../lib/api';

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(data);
      const token = res.data?.token || res.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1];
      if (token) localStorage.setItem('token', token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(data);
      const token = res.data?.token || res.headers['set-cookie']?.[0]?.split(';')[0]?.split('=')[1];
      if (token) localStorage.setItem('token', token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authAPI.getProfile();
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(payload.user));
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(payload.user));
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Profile
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.user = payload;
        localStorage.setItem('user', JSON.stringify(payload));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
