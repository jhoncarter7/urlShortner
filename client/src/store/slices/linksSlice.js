
import {  createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient.js';
import { logoutUser } from './authSlice.js';


export const fetchLinks = createAsyncThunk('links/fetchLinks', async (_, { rejectWithValue, getState }) => {
    if (!getState().auth.isAuthenticated) {
        return rejectWithValue('User not authenticated');
    }
    try {
      const response = await apiClient.get('/analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch links');
    }
  });
  
  export const shortenUrl = createAsyncThunk('links/shortenUrl', async (linkData, { rejectWithValue, getState }) => {
     if (!getState().auth.isAuthenticated) {
        return rejectWithValue('User not authenticated');
    }
    try {
      const response = await apiClient.post('/shorten', linkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to shorten URL');
    }
  });
  
  const linksSlice = createSlice({
    name: 'links',
    initialState: {
      items: [],
      loading: false,
      error: null,
      shortenLoading: false,
      shortenError: null,
      shortenSuccess: null,
    },
    reducers: {
        clearShortenStatus: (state) => {
            state.shortenError = null;
            state.shortenSuccess = null;
        },
        clearLinks: (state) => {
            state.items = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchLinks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLinks.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchLinks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(shortenUrl.pending, (state) => {
          state.shortenLoading = true;
          state.shortenError = null;
          state.shortenSuccess = null;
        })
        .addCase(shortenUrl.fulfilled, (state, action) => {
          state.shortenLoading = false;
          if (action.payload && action.payload.shortUrl) {
               state.items.unshift(action.payload);
               state.shortenSuccess = `Short URL created: ${action.payload.shortUrl}`;
          } else {
               state.shortenError = 'Received invalid data after shortening URL.';
          }
        })
        .addCase(shortenUrl.rejected, (state, action) => {
          state.shortenLoading = false;
          state.shortenError = action.payload;
        })
        .addCase(logoutUser.fulfilled, (state) => { 
            state.items = [];
            state.error = null;
            state.loading = false;
            state.shortenError = null;
            state.shortenSuccess = null;
        })
         .addCase(logoutUser.rejected, (state) => {
            state.items = [];
            state.error = null;
            state.loading = false;
             state.shortenError = null;
            state.shortenSuccess = null;
        });
    },
  });
  

  export const { clearShortenStatus, clearLinks } = linksSlice.actions;
  export const linksReducer = linksSlice.reducer;