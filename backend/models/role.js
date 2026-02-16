 import mongoose from "mongoose";
const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  permissions: [{ type: String }],

  inherits: [{ type: String }],   // names of parent roles

  overrides: [{ type: String }],  // only if roles have overrides (optional)
});

const Role=mongoose.models.Role || mongoose.model("Role",RoleSchema)

export default Role;
