import cron from "node-cron";
import User from "../models/EmbedApproach.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Token verification
export const tokenVerification = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      res.status(200).json("Valid Token");
      return;
    }
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ msg: "Token expired, please login again." });
    } else if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      res.status(403).json({ msg: "Invalid token." });
    } else {
      res.status(500).json({ msg: "Internal server error." });
    }
  }
};

// Getting a particular task from the database by the given taskId for a specific user
export const getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const task = user.tasks.find((task) => task.taskId === taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found for this user" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task for user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Getting list of all tasks in the database with pagination and sorted by taskstatus and deadline
export const getAllTasks = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (user.tasks.length === 0) {
      return res
        .status(404)
        .json({ msg: "Oops! No tasks available for this user." });
    }

    // Separate the default task at index 0
    const defaultTask = user.tasks[0];
    const otherTasks = user.tasks.slice(1);

    // Sorting order for taskStatus
    const statusOrder = { Completed: 1, Missed: 2, Pending: 3 };

    // Sort tasks based on status first, then deadline, then creation date
    const sortedTasks = otherTasks.sort((a, b) => {
      const statusDiff = statusOrder[a.taskStatus] - statusOrder[b.taskStatus];
      if (statusDiff !== 0) return statusDiff;

      const deadlineDiff = new Date(a.taskDeadline) - new Date(b.taskDeadline);
      if (deadlineDiff !== 0) return deadlineDiff;

      return new Date(a.taskCreatedAt) - new Date(b.taskCreatedAt);
    });
    console.log(user.tasks, otherTasks, sortedTasks);

    // Reinsert the default task at index 0
    sortedTasks.unshift(defaultTask);

    // Pagination (excluding the default task from page limits)
    const totalTasks = sortedTasks.length;
    const totalPages = Math.ceil(totalTasks / limitNumber);
    const paginatedTasks = sortedTasks.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    res.status(200).json({
      tasks: paginatedTasks,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Getting list of all tasks in the database without pagination
export const getAllTasksForAnalytics = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const tasks = user.tasks;
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({
        msg: "Oops! No tasks available for this user.",
      });
    }
  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Adding a new task in the database
export const postTask = async (req, res) => {
  const { taskName, taskDescription, taskDeadline, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userName: decoded.userName });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const deadline = new Date(taskDeadline);
    if (deadline < Date.now()) {
      return res.status(404).json({ msg: "Past dates can't be deadlines." });
    }

    const newTask = {
      taskName: taskName,
      taskDescription: taskDescription,
      taskDeadline: taskDeadline,
      taskId: uuidv4(), // You need to call `uuidv4()` function to generate a unique identifier
      taskCreatedAt: Date.now(),
      taskStatus: "Pending",
    };

    user.tasks.push(newTask);
    await user.save();

    res.status(201).json(user.tasks);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// updating details for the task in the database with the id
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { taskName, taskDescription, taskDeadline, taskStatus } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const taskToUpdate = user.tasks.find((task) => task.taskId === taskId);
    if (!taskToUpdate) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (taskToUpdate.taskStatus === "Default")
      return res.status(303).json({ msg: "Default Task can't be Updated." });

    if (taskName) taskToUpdate.taskName = taskName;
    if (taskDescription) taskToUpdate.taskDescription = taskDescription;
    if (taskDeadline) taskToUpdate.taskDeadline = taskDeadline;
    if (taskStatus) taskToUpdate.taskStatus = taskStatus;

    await user.save();

    res.status(200).json(taskToUpdate);
  } catch (error) {
    console.error("Error updating task for user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// deleting task from the database with the given id
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const taskToDelete = user.tasks.find((task) => task.taskId === taskId);
    if (!taskToDelete) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (taskToDelete.taskStatus === "Default")
      return res.status(303).json({ msg: "Default Task can't be Deleted." });

    user.tasks = user.tasks.filter((item) => item !== taskToDelete);
    await user.save();

    res.status(200).json(taskToDelete);
  } catch (error) {
    console.error("Error deleting task for user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get task by status
export const getTasksByStatus = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const tasks = user.tasks
      .filter((task) => task.taskStatus === status)
      .slice(skip, skip + parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get tasks by date of creation for a specific user
export const getTasksByCreationDate = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const desiredDate = new Date(req.body.date);
    const nextDay = new Date(desiredDate);
    nextDay.setDate(desiredDate.getDate() + 1); // Get the next day

    const desiredTasks = user.tasks
      .filter((task) => {
        const taskCreatedAt = new Date(task.taskCreatedAt);
        return taskCreatedAt >= desiredDate && taskCreatedAt < nextDay;
      })
      .slice(skip, skip + limit);

    res.status(200).json(desiredTasks);
  } catch (error) {
    console.error("Error fetching tasks by creation date:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get tasks by date of deadline for a specific user
export const getTasksByDeadlineDate = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const deadlineDate = new Date(req.body.date);

    const tasks = user.tasks
      .filter((task) => {
        const taskDeadline = new Date(task.taskDeadline);
        return taskDeadline <= deadlineDate;
      })
      .slice(skip, skip + limit);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by deadline date:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get tasks by task title search for a specific user
export const getTasksByName = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userName: decoded.userName });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const tasks = user.tasks
      .filter((task) =>
        task.taskName.toLowerCase().includes(req.body.title.toLowerCase())
      )
      .slice(skip, skip + limit);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by title:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Function to update task statuses from "Pending" to "Missed" if the deadline has passed
const updateAllPendingTasks = async () => {
  try {
    const users = await User.find({});

    for (const user of users) {
      for (const task of user.tasks) {
        if (task.taskStatus === "Pending" && task.taskDeadline < new Date()) {
          task.taskStatus = "Missed";
        }
      }
      await user.save();
    }
  } catch (error) {
    console.error("Error updating pending tasks:", error);
  }
};

// Schedule the task to run every midnight (00:00 am)
cron.schedule(
  "0 0 * * *",
  () => {
    updateAllPendingTasks();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set the timezone to India (IST)
  }
);
