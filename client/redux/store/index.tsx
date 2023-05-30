import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/redux/reducers'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})