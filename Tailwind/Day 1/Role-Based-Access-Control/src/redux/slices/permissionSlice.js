import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  roleId: null,
  roleName: null,
  modulePermissions: [],
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      state.id = action.payload.id;
      state.roleId = action.payload.roleId;
      state.roleName = action.payload.roleName;
      state.modulePermissions = action.payload.modulePermissions;
    },
    clearPermissions: (state) => {
      state.id = null;
      state.roleId = null;
      state.roleName = null;
      state.modulePermissions = [];
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
