export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface AuthUser {
  _id: string;       // match backend
  name: string;
  email: string;
  token:string;
  phone?: string;
  role: Role[];     // plural (match backend)
  address?: Address;

}