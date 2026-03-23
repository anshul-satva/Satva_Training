import axiosInstance from '../utils/axiosInstance'

export const loginService = async (email, password) => {
  const response = await axiosInstance.post('/login', { email, password })
  return response.data
}