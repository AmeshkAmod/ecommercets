import RoleModel from "../models/role.js";

type RolePermissionMap = Map<string, Set<string>>;

let rolePermissionCache: RolePermissionMap = new Map();

/* =========================
   Build Role Permission Map
========================= */
export async function buildRolePermissionCache() {
  const roles = await RoleModel.find();

  const roleMap = new Map(
    roles.map((r) => [r.name, r])
  );

  const visited = new Set<string>();

  function resolvePermissions(roleName: string): Set<string> {
    if (rolePermissionCache.has(roleName)) {
      return rolePermissionCache.get(roleName)!;
    }

    const role = roleMap.get(roleName);
    if (!role) return new Set();

    if (visited.has(roleName)) {
      return new Set(); // prevent circular
    }

    visited.add(roleName);

    const perms = new Set<string>(role.permissions || []);

    (role.inherits || []).forEach((parent) => {
      const parentPerms = resolvePermissions(parent);
      parentPerms.forEach((p) => perms.add(p));
    });

    rolePermissionCache.set(roleName, perms);

    return perms;
  }

  roles.forEach((role) => {
    resolvePermissions(role.name);
  });

  console.log("RBAC cache built successfully");
}

/* =========================
   Get Permissions For Roles
========================= */
export function getPermissionsForRoles(
  roles: string[]
): Set<string> {
  const perms = new Set<string>();

  roles.forEach((roleName) => {
    const rolePerms = rolePermissionCache.get(roleName);
    if (rolePerms) {
      rolePerms.forEach((p) => perms.add(p));
    }
  });

  return perms;
}
