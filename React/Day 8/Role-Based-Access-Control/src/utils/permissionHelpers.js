const ACTION_IDS = {
  view: 1,
  add: 2,
  edit: 3,
  delete: 4,
};

export const hasPermission = (permissions, moduleName, action) => {
  if (!permissions?.modulePermissions?.length) return false;

  const moduleEntry = permissions.modulePermissions.find(
    (m) => m.moduleName === moduleName,
  );

  if (!moduleEntry) return false;

  const actionId = ACTION_IDS[action];
  return moduleEntry.allowedActionIds.includes(actionId);
};

export const getAccessibleModules = (permissions) => {
  if (!permissions?.modulePermissions?.length) return [];

  return permissions.modulePermissions
    .filter((m) => m.allowedActionIds.includes(ACTION_IDS.view))
    .map((m) => m.moduleName);
};
