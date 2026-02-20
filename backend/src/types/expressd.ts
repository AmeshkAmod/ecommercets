import { Types } from "mongoose";

declare global {
  namespace Express {
    interface AuthUser {
      _id: Types.ObjectId;
      email: string;
      name?: string;
      roles: string[];
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
