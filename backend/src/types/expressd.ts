import type { User } from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                email: string;
                roles: string[];
            };
        }
    }
}