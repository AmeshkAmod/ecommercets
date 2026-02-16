import type { NextFunction, Request, Response } from "express";
import Role from "../models/role.js";

interface RoleDoc {
  name: string;
  permissions?: string[];
  inherits?: string[];
}

export async function getEffectivePermissions(
  user: Express.AuthenticatedUser,
): Promise<Set<string>> {
  const roleDocs = (await Role.find({ name: { $in: user.roles } }).lean()) as unknown as RoleDoc[];

  const visited = new Set<string>();
  const stack: RoleDoc[] = [...roleDocs];
  const perms = new Set<string>(user.overrides ?? []);

  while (stack.length) {
    const role = stack.pop();
    if (!role) {
      continue;
    }

    if (visited.has(role.name)) {
      continue;
    }
    visited.add(role.name);

    (role.permissions ?? []).forEach((permission: string) => {
      perms.add(permission);
    });

    (role.inherits ?? []).forEach((roleName: string) => {
      const inherited = roleDocs.find((candidate: RoleDoc) => candidate.name === roleName);
      if (inherited) {
        stack.push(inherited);
      }
    });
  }

  return perms;
}

export function requirePermissions(...needed: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "unauthenticated" });
      }

      const perms = await getEffectivePermissions(user);
      const missing = needed.filter((permission: string) => !perms.has(permission));
      if (missing.length > 0) {
        return res.status(403).json({ error: "forbidden", missing });
      }

      next();
    } catch (err: unknown) {
      next(err);
    }
  };
}
