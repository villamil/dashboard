import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    showMessage: false,
    title: '',
    variant: '',
    message: '',
  },
  reducers: {
    showMessage: (state, action) => {
      state.showMessage = action.payload.showMessage;
      state.title = action.payload.title;
      state.variant = action.payload.variant;
      state.message = action.payload.message;
    },
  },
})

// Action creators are generated for each case reducer function
export const { showMessage } = messageSlice.actions

export default messageSlice.reducer