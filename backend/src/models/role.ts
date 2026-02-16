import mongoose from "mongoose";
const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  permissions: [{ type: String }],

  inherits: [{ type: String }],   // names of parent roles

  overrides: [{ type: String }],  // only if roles have overrides (optional)
});

const Role: mongoose.Model<any> =
  (mongoose.models.Role as mongoose.Model<any>) ||
  mongoose.model("Role", RoleSchema);

export default Role;
