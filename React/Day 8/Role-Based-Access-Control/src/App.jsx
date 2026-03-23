import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouter'
import React from 'react'
import { usePermissionSync } from './hooks/usePermissionSync'

const App = () => {
  usePermissionSync();
  return (
    <RouterProvider router={router}/>
  )
}

export default App