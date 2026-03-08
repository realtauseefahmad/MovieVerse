import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    trailerModalOpen: false,
    trailerMovieId: null,
    trailerIsTV: false,
  },
  reducers: {
    openTrailerModal: (state, { payload }) => {
      state.trailerModalOpen = true;
      state.trailerMovieId = typeof payload === 'object' ? payload.id : payload;
      state.trailerIsTV = typeof payload === 'object' ? !!payload.isTV : false;
    },
    closeTrailerModal: (state) => {
      state.trailerModalOpen = false;
      state.trailerMovieId = null;
      state.trailerIsTV = false;
    },
  },
});

export const { openTrailerModal, closeTrailerModal } = uiSlice.actions;
export default uiSlice.reducer;
