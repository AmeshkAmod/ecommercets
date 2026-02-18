import type { Request, Response, NextFunction } from "express";
import { getPermissionsForRoles } from "../services/rbacService.js";
import type { PermissionKeys } from "../types/rbacTypes.js";

export function requirePermissions(
  ...needed: PermissionKeys[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: "unauthenticated",
      });
    }

    const perms = getPermissionsForRoles(
      req.user.roles
    );

    const ok = needed.every((p) =>
      perms.has(p)
    );

    if (!ok) {
      return res.status(403).json({
        error: "forbidden",
        missing: needed.filter(
          (p) => !perms.has(p)
        ),
      });
    }

    next();
  };
}
