export interface Role {
    _id: string;
    name: string;
    permissions: string[];
}

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: Role[];
}