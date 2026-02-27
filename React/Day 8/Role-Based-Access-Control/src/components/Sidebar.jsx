import React from 'react'
import { Menu } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  ProjectOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAccessibleModules } from '../utils/permissionHelpers'

const MODULE_CONFIG = {
  users:     { label: 'Users',       icon: <TeamOutlined />,    path: '/users'     },
  employees: { label: 'Employees',   icon: <UserOutlined />,    path: '/employees' },
  projects:  { label: 'Projects',    icon: <ProjectOutlined />, path: '/projects'  },
  roles:     { label: 'Permissions', icon: <SafetyOutlined />,  path: '/roles'     }
}

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const permissions = useSelector((state) => state.permissions)

  const accessibleModules = getAccessibleModules(permissions)

  console.log('permissions:', permissions)           
  console.log('accessibleModules:', accessibleModules) 

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    ...accessibleModules.map((moduleName) => {
      const config = MODULE_CONFIG[moduleName]
      if (!config) return null
      return {
        key: config.path,
        icon: config.icon,
        label: config.label
      }
    }).filter(Boolean)
  ]

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{ borderRight: 0, paddingTop: 8 }}
    />
  )
}

export default Sidebar