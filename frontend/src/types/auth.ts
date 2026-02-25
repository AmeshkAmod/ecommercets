export enum PermissionKeys {
  CREATE_PRODUCT = "product.create",
  UPDATE_PRODUCT = "product.update",
  DELETE_PRODUCT = "product.delete",
  CREATE_ORDER = "order.create",
  VIEW_USERS = "user.manage",
}


export interface Role {
  _id: string;
  name: string;
  permissions: PermissionKeys[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role[];
}