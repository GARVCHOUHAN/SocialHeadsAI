import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  idea: { type: String, required: true },
  scriptDone: { type: Boolean, default: false },
  filmed: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
  posted: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  notes: { type: String, default: "" },
  // Add these fields to your Task schema
  scheduledDate: Date,
  videoFile: String, // store file path or filename
  uploaded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;