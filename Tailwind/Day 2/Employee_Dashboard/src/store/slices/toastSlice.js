import { createSlice } from '@reduxjs/toolkit'

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    showToast(state, { payload }) {
      state.items.push({
        id:      Date.now(),
        message: payload.message,
        type:    payload.type || 'success',
      })
    },
    removeToast(state, { payload }) {
      state.items = state.items.filter(t => t.id !== payload)
    },
  },
})

export const { showToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
