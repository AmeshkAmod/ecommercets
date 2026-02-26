// config/authRoles.js

import Role from "../models/role.js";

export const roles = [
  {
    name: "ADMIN",
    permissions: [
      "product.create",
      "product.update",
      "product.delete",
      "user.manage",
    ],
  },
  {
    name: "MANAGER",
    permissions: ["product.create", "product.update"],
  },
  {
    name: "USER",
    permissions: ["product.read"],
  },
];

export async function seedRoles() {
  for (const role of roles) {
    await Role.updateOne({ name: role.name }, { $set: role }, { upsert: true });
  }
  console.log("Roles seeded successfully");
}
