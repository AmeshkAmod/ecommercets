export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  role: Role[];
}
