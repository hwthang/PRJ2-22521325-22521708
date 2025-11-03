class PermissionHelper {
  RBAC = {
    admin: ["view_accounts"],
    chapter:[],
    member: [],
  };
  hasPermission = (role, permission) => this.RBAC[role]?.includes(permission);
}
export default new PermissionHelper();