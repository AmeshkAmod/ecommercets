import mongoose, { Schema } from "mongoose";
import type { InferSchemaType, HydratedDocument } from "mongoose";


const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    roles: [
      { 
        type: Schema.Types.ObjectId, 
        ref: "Role" 
      }
    ],

    overrides: [
      { 
        type: Schema.Types.ObjectId, 
        ref: "Permission" 
      }
    ],
  },
  { timestamps: true }
);

//to automatically infer types from schema
export type User = InferSchemaType<typeof userSchema>;

//real mongoose doc type 
export type UserDocument = HydratedDocument<User>;

//Prevent model overwrite
const UserModel = 
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
