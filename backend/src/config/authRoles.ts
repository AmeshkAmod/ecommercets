// config/authRoles.js

import Role from "../models/role.js";


interface seedRoles{
 
  name:string,
  permissions:string[];

}

export const roles:seedRoles[] = [
  {
    name: "admin",
    permissions: [
        "product.create",
         "product.update",
          "product.delete",
           "user.manage"
        ]
  },
  {
    name: "manager",
    permissions: [
        "product.create",
         "product.update"
        ]
  },
  {
    name: "customer",
    permissions: ["product.read"]
  }
];

export async function seedRoles():Promise<void> {
    for (const role of roles) {
    await Role.updateOne(
        { name: role.name },
        { $set: role },
        { upsert: true }
    );
    }
    console.log("Roles seeded successfully");
}