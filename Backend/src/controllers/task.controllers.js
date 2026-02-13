import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype, //File type/format  => image/png, application/pdf
      size: file.size,
    };
  });

  const task = new Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully", task));
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(201)
    .json(new ApiResponse(200, "Task fetched successfully", task));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElem: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  //chai
  const { taskId } = req.params;
  const { title, description, status, assignedTo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid taskId");
  }

  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (status) updateFields.status = status;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      set: updateFields,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  //chai
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId))
    throw new ApiError(400, "Invalid task id");

  const deletedTask = await Task.findByIdAndDelete(taskId);

  if (!deletedTask) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  //chai
  const { title, status } = req.body;
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId))
    throw new ApiError(400, "Invalid task id");

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!title || !status) {
    throw new ApiError(400, "All fields are required");
  }

  const subtask = new Subtask.create({
    title,
    task,
    status,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  //chai
  const { subtaskId } = req.params;
  const { title, status } = req.body;

  if (!mongoose.Tyoes.ObjectId.isValid(subtaskId)) {
    throw new ApiError(400, "Invalid Subtask id");
  }

  const updatedSubTask = await Subtask.findByIdAndUpdate(
    subtaskId,
    {
      set: { title, status },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubTask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  //chai
  const { subtaskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subtaskId)) {
    throw new ApiError(400, "Invalid subtask ID");
  }

  const deleteSubtask = await Subtask.findByIdAndDelete(subtaskId);

  if (!deleteSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subtask deleted successfully"));
});

export {
  createSubTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
  deleteTask,
  createTask,
};
