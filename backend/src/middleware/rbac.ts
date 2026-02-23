import type { Request, Response, NextFunction } from "express";
import { getPermissionsForRoles } from "../services/rbacService.js";
import type { PermissionKeys } from "../types/rbacTypes.js";

export function requirePermissions(...needed: PermissionKeys[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log("❌ No user on request");
      return res.status(401).json({ error: "unauthenticated" });
    }

    console.log("JWT roles:", req.user.roles);

    const perms = getPermissionsForRoles(req.user.roles);

    console.log("Resolved permissions:", [...perms]);
    console.log("Needed permissions:", needed);

    const ok = needed.every((p) => perms.has(p));

    console.log("Permission check result:", ok);

    if (!ok) {
      return res.status(403).json({
        error: "forbidden",
        missing: needed.filter((p) => !perms.has(p)),
      });
    }

    next();
  };
}