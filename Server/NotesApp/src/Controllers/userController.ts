import User from "../models/User";
import Note from "../models/Note";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import {Request, Response} from "express";
import { DeleteResult, Document } from "mongoose";

// @desc GET all users
// @route GET /users
// @access private

const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    res.status(400).json({ message: "No users found" });
    return;
  }
  res.json(users);

});

// @desc Create new user
// @route POST /user
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { userName, password, roles } = req.body;
  if (!userName || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate username" });
    return;
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { userName, password: hashedPwd, roles };

  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New user ${userName} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }

});

// @desc Update new user
// @route PATCH /user
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, userName, roles, active, password } = req.body;
  console.log("** here", req.body);

  console.log(id, userName, roles, active, password);

  if (!id || !userName || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
    res.status(404).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  } 

  // new userName should be unique
  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate username" });
    return;
  }

  user.userName = userName;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.userName} updated` });
});

// @desc Delet new user
// @route DELETE /user
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "User ID required" });
    return;
  }

  const notes = await Note.find({ user: id }).lean().exec();
  if (notes?.length > 0) {
    res.json({ message: "User has assigned notes" });
    return;
  }

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  const result: DeleteResult = await user.deleteOne();
  if (result.deletedCount === 0) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  res.json({ message: `User ${user.userName} with ID ${id} deleted` });

});

export const userController = {
  listUsers,
  createNewUser,
  updateUser,
  deleteUser,
}