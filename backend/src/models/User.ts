import mongoose, { Schema } from "mongoose";
import type { InferSchemaType, HydratedDocument } from "mongoose";
import { NextFunction } from "express";
import bcrypt from "bcrypt";


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

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
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

userSchema.pre("save", async function () {
  const user = this as UserDocument;

  if (!user.isModified("password")) 
    return ;
  
  this.password = await bcrypt.hash(this.password, 10);
});

//to automatically infer types from schema
export type User = InferSchemaType<typeof userSchema>;

//real mongoose doc type 
export type UserDocument = HydratedDocument<User>;

//Prevent model overwrite
const UserModel = 
  mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);

export default UserModel;
