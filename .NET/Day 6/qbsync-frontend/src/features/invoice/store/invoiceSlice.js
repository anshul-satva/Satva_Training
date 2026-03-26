import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../shared/api/client'

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchAll',
  async (realmId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/invoices?realmId=${encodeURIComponent(realmId)}`)
      return res.data.data || []
    } catch (err) {
      console.error('[Fetch Invoices Error]:', err.response?.data)
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.inner ||
        'Failed to fetch invoices.'
      )
    }
  }
)

export const deleteInvoice = createAsyncThunk(
  'invoice/delete',
  async ({ id, realmId }, { rejectWithValue }) => {
    try {
      await api.delete(`/invoices/${id}?realmId=${realmId}`)
      return id
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete invoice.'
      )
    }
  }
)

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.items = [] 
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload)
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { clearError } = invoiceSlice.actions
export default invoiceSlice.reducer
