import type { Request, Response, NextFunction } from "express";
import Role from "../models/role.js";

export async function getEffectivePermissions(user) {
  // Fetch all roles the user has
  const roleDocs = await Role.find({ name: { $in: user.roles } });

  const visited = new Set();
  const stack = [...roleDocs];

  // Convert user overrides to Set
  const perms = new Set(user.overrides || []);

  while (stack.length) {
    const role = stack.pop();
    if (!role) continue; // ❗ important safety check

    if (visited.has(role.name)) continue;
    visited.add(role.name);

    // Add role's permissions
    (role.permissions || []).forEach((p) => perms.add(p));

    // Process inherited roles
    (role.inherits || []).forEach((rn) => {
      const inherited = roleDocs.find((r) => r.name === rn);
      if (inherited) stack.push(inherited); // ❗ only push if exists
    });
  }

  return perms;
}

export function requirePermissions(...needed) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user; // set by your auth middleware

      if (!user)
        return res.status(401).json({ error: "unauthenticated" });

      const perms = await getEffectivePermissions(user);

      const ok = needed.every((p) => perms.has(p));
      if (!ok) {
        return res.status(403).json({
          error: "forbidden",
          missing: needed.filter((p) => !perms.has(p)),
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
