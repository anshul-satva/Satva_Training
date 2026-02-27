import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions } from "../redux/slices/permissionSlice";
import axios from "axios";

export const usePermissionSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const roleId = user?.roleId;
  const token = useSelector((state) => state.auth.token); 

  useEffect(() => {
    if (!roleId) return;

    const syncPermissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/permissions?roleId=${roleId}`, 
          {
            headers: { Authorization: `Bearer ${token}` }, 
          }
        );
        const permissions = response.data[0]; 
        if (permissions) {
          dispatch(setPermissions(permissions));
        }
      } catch (err) {
        console.error("Permission sync failed", err);
      }
    };

    syncPermissions();
    const interval = setInterval(syncPermissions, 1000);
    return () => clearInterval(interval);
  }, [roleId, token, dispatch]);
};