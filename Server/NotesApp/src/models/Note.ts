import mongoose, { Document, Types } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
// @ts-ignore
const AutoIncrement = AutoIncrementFactory(mongoose);

export interface Notes extends Document {
  user: Types.ObjectId;
  title: String;
  text: String;
  completed: Boolean;
  ticket: Number;
}

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// @ts-ignore
noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500
});

export default mongoose.model<Notes>("Note", noteSchema);