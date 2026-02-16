import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }],
    overrides: [{ type: String, ref: "Permission" }],
  },
  { timestamps: true }
);

const User: mongoose.Model<any> =
  (mongoose.models.User as mongoose.Model<any>) ||
  mongoose.model("User", userSchema);

export default User;
