import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface AuthenticatedUser {
      _id: Types.ObjectId;
      name: string;
      email: string;
      roles: string[];
      overrides?: string[];
      isAdmin?: boolean;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
