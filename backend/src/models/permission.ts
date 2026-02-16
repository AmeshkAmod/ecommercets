import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  description: { type: String }
}, { timestamps: true });

const Permission =
  mongoose.models.Permission ||
  mongoose.model("Permission", PermissionSchema);

export default Permission;
