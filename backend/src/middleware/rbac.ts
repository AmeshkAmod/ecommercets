import { Request, Response, NextFunction } from "express";
import Role from "../models/role.js";

export interface AuthUser {
  roles: string[];
  overrides?: string[];
}

export async function getEffectivePermissions(
  user: AuthUser,
): Promise<Set<string>> {
  const roleDocs = await Role.find({
    name: { $in: user.roles },
  });

  const visited = new Set<string>();
  const stack = [...roleDocs];
  const perms = new Set<string>(user.overrides ?? []);

  while (stack.length) {
    const role = stack.pop();
    if (!role) continue;
    if (visited.has(role.name)) continue;
    visited.add(role.name);

    role.permission?.forEach((p) => perms.add(p));

    role.inherits?.forEach((rn) => {
      const inherited = roleDocs.find((r) => r.name === rn);
      if (inherited) stack.push(inherited);
    });
  }

  return perms;
}

export function requirePermissions(...needed: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser | undefined;

      if (!user) {
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      const perms = await getEffectivePermissions(user);

      const ok = needed.every((p) => perms.has(p));
      if (!ok) {
        res.status(403).json({
          error: "forbidden",
          missing: needed.filter((p) => !perms.has(p)),
        });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
