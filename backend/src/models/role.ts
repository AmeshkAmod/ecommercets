 import mongoose,{Schema,Document,Model} from "mongoose";
import { inherits } from "node:util";


 export interface IRole extends Document{
  name:string,
  permissions:string[],
  inherits?:string[],
  overrides?:string[];
 }
const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },

  permissions: [{ type: String }],

  inherits: [{ type: String }],   // names of parent roles

  overrides: [{ type: String }],  // only if roles have overrides (optional)
});

const Role:Model<IRole>=mongoose.models.Role || mongoose.model<IRole>("Role",RoleSchema);

export default Role;
