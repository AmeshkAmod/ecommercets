 import mongoose, { Schema } from "mongoose";
 import type { InferSchemaType,HydratedDocument } from "mongoose";

 //schema
const roleSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      uppercase: true,
    },

    permissions: [
      { 
        type: Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

//explicit unique index on role name
roleSchema.index({ name: 1 }, { unique: true });

//infer type from schema
export type Role = InferSchemaType<typeof roleSchema>;

//hydrated doc type
export type RoloDocument = HydratedDocument<Role>;

//model
const RoleModel = 
mongoose.models.Role || mongoose.model("Role",roleSchema)

export default RoleModel;
