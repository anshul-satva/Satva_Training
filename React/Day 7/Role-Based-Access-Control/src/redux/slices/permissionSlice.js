import { createSlice } from "@reduxjs/toolkit";
import { React } from "react";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    id: null,
    roleId: null,
    roleName: null,
    modulePermissions: [],
  },
  reducers : {
    setPermissions : (state, action) => {
        state.id = action.payload.id,
        state.roleId = action.payload.roleId,
        state.roleName = action.payload.roleName,
        state.modulePermissions = action.payload.modulePermissions
    },
    clearPermission : (state) => {
        state.id = null,
        state.roleId = null,
        state.roleName = null,
        state.modulePermissions = []
     }
  }
});

export const {setPermissions, clearPermission} = permissionSlice.actions
export default permissionSlice
