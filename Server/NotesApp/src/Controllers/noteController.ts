import User, { IUser, Role } from "../models/User";
import Note, { Notes } from "../models/Note";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import {Request, Response} from "express";
import { DeleteResult, Document, Types } from "mongoose";


const listAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const notes = await Note.find().lean();
  if (!notes.length) {
    res.status(400).json({ message: "No notes found" });
    return;
  }
  res.json(notes);
});

// @desc GET all notes
// @route GET /notes
// @access private

const listNotes = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ message: "User ID required" });
    return;
  }

  const userDetails = await User.findById({ _id: userId}).lean().exec();
  if (userDetails?.roles?.includes(Role.ADMIN) || userDetails?.roles?.includes(Role.MANAGER)) {
    const notes = await Note.find().lean();
    if (!notes?.length) {
      res.status(400).json({ message: "No notes found" });
      return;
    }
    res.json(notes);
  } else {
    const notes = await Note.find({ user: userId }).lean().exec();
    if (!notes?.length) {
      res.status(400).json({ message: "No notes found" });
      return;
    }
    res.json(notes);
  }
});

const getNote = asyncHandler(async (req: Request, res: Response) => {
  const { ticket, userId } = req.body;
  if (!ticket || !userId) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const userDetails = await User.findById({ _id: userId}).lean().exec();
  if (userDetails?.roles.includes(Role.EMPLOYEE)) {
    const note = await Note.findOne({ ticket, user: userId }).lean().exec();
    if (!note) {
      res.status(400).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  } else {
    const note = await Note.findOne({ ticket }).lean().exec();
    if (!note) {
      res.status(400).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  }

});

const createNewNote = asyncHandler(async (req: Request, res: Response) => {
  const { user, title, text, completed } = req.body;
  if (!user || !title || !text) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const duplicate = await Note.findOne({ user, title, text, completed }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate note" });
    return;
  }

  const note = await Note.create({ user, title, text, completed });
  if (note) {
    res.status(201).json({ message: `New note ${title} created` });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }

});

const editNote = asyncHandler(async (req: Request, res: Response) => {
  const { id, text, title, completed } = req.body;
  if (!id) {
    res.status(400).json({ message: "Note ID required" });
    return;
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: "Note not found to update" });
    return;
  }

  if (text) note.text = text;
  if (title) note.title = title;
  if (completed?.toString()) note.completed = completed;

  const updatedNote = await note.save();
  res.json({ message: `${updatedNote.title} updated` });
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "Note ID required" });
    return;
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: "Note not found" });
    return;
  }

  const userDetails = await User.findById(note.user).lean().exec();
  console.log("** userDetails", userDetails);

  // if (userDetails?.roles?.includes(Role.EMPLOYEE)) {
  //   res.status(400).json({ message: "You are not authorized to delete this note" });
  //   return;
  // } else {
    const result = await note.deleteOne();
    if (result.deletedCount === 0) {
      res.status(400).json({ message: "Note not found" });
      return;
    }
    const reply = `Note ${note.title} with ID ${note._id} deleted`;
    res.json(reply);
  // }

});

export const noteController = {
  listAllNotes,
  listNotes,
  getNote,
  createNewNote,
  editNote,
  deleteNote
};