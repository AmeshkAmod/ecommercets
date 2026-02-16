// config/authRoles.js

import Role from "../models/role.js";

export const roles = [
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

export async function seedRoles() {
    for (const role of roles) {
    await Role.updateOne(
        { name: role.name },
        { $set: role },
        { upsert: true }
    );
    }
    console.log("Roles seeded successfully");
}