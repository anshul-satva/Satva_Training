import axiosInstance from '../utils/axiosInstance'

export const getAllRoles = async () => {
  const response = await axiosInstance.get('/roles')
  return response.data
}