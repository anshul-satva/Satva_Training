const TOKEN_KEY = 'collabspace_token';
const ACTIVE_ORG_KEY = 'collabspace_active_org';

export const storage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getActiveOrganizationId() {
    return localStorage.getItem(ACTIVE_ORG_KEY);
  },
  setActiveOrganizationId(organizationId: string) {
    localStorage.setItem(ACTIVE_ORG_KEY, organizationId);
  },
  clearActiveOrganizationId() {
    localStorage.removeItem(ACTIVE_ORG_KEY);
  },
};
