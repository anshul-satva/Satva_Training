import axiosInstance from '../utils/axiosInstance'

export const getAllEmployees = async () => {
  const response = await axiosInstance.get('/employees')
  return response.data
}

export const searchEmployees = async (query) => {
  const response = await axiosInstance.get(`/employees?name_like=${query}`)
  return response.data
}

export const createEmployee = async (data) => {
  const response = await axiosInstance.post('/employees', data)
  return response.data
}

export const updateEmployee = async (id, data) => {
  const response = await axiosInstance.patch(`/employees/${id}`, data)
  return response.data
}

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/employees/${id}`)
  return response.data
}