import axiosInstance from '../utils/axiosInstance'

export const getAllPermissions = async () => {
  const response = await axiosInstance.get('/permissions')
  return response.data
}

export const updatePermission = async (id, modulePermissions) => {
  const response = await axiosInstance.patch(`/permissions/${id}`, {
    modulePermissions
  })
  return response.data
}