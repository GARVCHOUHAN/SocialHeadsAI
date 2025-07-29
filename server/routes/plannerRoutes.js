
import express from "express";
import Task from "../models/Tasks.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post("/add", upload.single("videoFile"), async (req, res) => {
  const { title, idea, scriptDone, filmed, edited, posted, views, notes, scheduledDate } = req.body;
  const videoFile = req.file ? req.file.path : null;
  const task = new Task({
    title,
    idea,
    scriptDone,
    filmed,
    edited,
    posted,
    views,
    notes,
    scheduledDate,
    videoFile,
    uploaded: false
  });
  await task.save();
  res.json(task);
});

export default router;