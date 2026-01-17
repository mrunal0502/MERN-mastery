import mongoose, { Schema } from "mongoose";
import { TaskStatusEnum, AvailableTaskStatus } from "../utils/constants.js";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: AvailableTaskStatus,
    default: TaskStatusEnum.TODO,
  },
  attachments: {
    type: [
      {
        url: String,
        mimetype: String,
        size: Number,
      },
    ],
    default: [],
  },
});

export const Task = mongoose.model("Tasks", taskSchema);
