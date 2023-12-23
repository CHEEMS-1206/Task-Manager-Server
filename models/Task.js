import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  taskCreatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  taskDeadline: {
    type: Date,
    required: true,
  },
  taskStatus: {
    type: String,
    enum: ["Completed", "Pending", "Missed"],
    default: "Pending",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;