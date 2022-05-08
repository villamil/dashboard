import { configureStore } from '@reduxjs/toolkit'
import messageSlice from './features/message';

export default configureStore({
  reducer: {
      message: messageSlice
  },
})
