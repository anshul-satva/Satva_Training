import axiosInstance from '../utils/axiosInstance'

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users')
  return response.data
}

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/users?name_like=${query}`)
  return response.data
}

export const createUser = async (data) => {
  const response = await axiosInstance.post('/users', data)
  return response.data
}

export const updateUser = async (id, name) => {
  const response = await axiosInstance.patch(`/users/${id}`, { name })
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`)
  return response.data
}