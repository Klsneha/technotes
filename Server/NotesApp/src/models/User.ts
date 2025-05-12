import mongoose, { Document } from "mongoose";

export enum Role {
  EMPLOYEE = "employee",
  ADMIN = "admin",
  MANAGER = "manager",
}

export interface IUser extends Document {
  userName: String;
  password: string;
  roles: Role[];
  active: Boolean;
}
const userSchema = new mongoose.Schema({
  
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String], // Array of strings
    enum: Object.values(Role), // Ensures only valid roles are allowed
    default: [Role.EMPLOYEE], // Default role
  },
  active: {
    type: Boolean,
    default: true
  }
});
export default mongoose.model<IUser>("User", userSchema);