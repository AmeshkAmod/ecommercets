import mongoose, { Schema, model, HydratedDocument } from "mongoose";
import { permission } from "node:process";
import { Interface } from "node:readline";
import { inherits } from "node:util";

export interface IRole {
  name: string;
  permissions: string[];
  inherits: string[];
  overrides: string[];
}

export type RoleDocument = HydratedDocument<IRole>;
const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },

  permissions: [{ type: String }],

  inherits: [{ type: String }], // names of parent roles

  overrides: [{ type: String }], // only if roles have overrides (optional)
});

const Role = mongoose.models.Role || model<IRole>("Role", RoleSchema);

export default Role;
