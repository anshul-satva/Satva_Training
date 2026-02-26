import { useSelector } from 'react-redux'
import { hasPermission } from '../utils/permissionHelpers'

// Wrap any button/element to show only if user has permission
// Usage: <PermissionGate module="users" action="add">
//          <Button>Add User</Button>
//        </PermissionGate>

function PermissionGate({ module, action, children, fallback = null }) {
  const permissions = useSelector((state) => state.permissions)

  if (hasPermission(permissions, module, action)) {
    return children
  }

  return fallback
}

export default PermissionGate