import mongoose, { Schema } from "mongoose";
import type { InferSchemaType, HydratedDocument } from "mongoose";

const permissionSchema = new Schema(
  {
    key: { 
      type: String, 
      required: true,
      trim: true,
    },
    description: { 
      type: String,
      trim: true,
      
    }
  }, { timestamps: true });
  
  //explicit unique index on key
  permissionSchema.index({ key: 1 }, { unique: true });

  //infer type from schema
  export type Permission = InferSchemaType<typeof permissionSchema>;

  //mongoose doc types
  export type PermissionDocument = HydratedDocument<Permission>;

const PermissionModel =
  mongoose.models.Permission ||mongoose.model("Permission", permissionSchema);

export default PermissionModel;
