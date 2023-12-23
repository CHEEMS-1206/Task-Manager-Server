// Controllers for tasks '/' after URL => http://localhost:5000/api/

// cron for job scheduling
import cron from "node-cron";

// importing model for task
import Task from "../models/Task.js";

// getting a particular task from the database by the given id
export const getTask = async (req, res) => {
  try {
    const query = await Task.findOne({ taskId: req.params.id });
    if (query) {
      res.status(200).json(query);
    } else {
      res.status(400).json({
        msg: "No tasks found with this id !",
      });
    }
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};

// Getting list of all tasks in the database with pagination
export const getAllTasksForAnalytics = async (req, res) => {
  try {
    const tasks = await Task
      .find()

    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({
        msg: "Oops! No tasks available.",
      });
    }
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

// Getting list of all tasks in the database with pagination
export const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 25, if not provided

  try {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const totalUsers = await Task.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limitNumber);

    const tasks = await Task
      .find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (tasks.length > 0) {
      res.status(200).json({
        tasks,
        currentPage: pageNumber,
        totalPages,
      });
    } else {
      res.status(404).json({
        msg: "Oops! No tasks available.",
      });
    }
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
};

// Adding a new task in the database
export const postTask = async (req, res) => {
  const newTask = new Task({
    taskName : req.body.taskName,
    taskDescription : req.body.taskDescription,
    taskDeadline : req.body.taskDeadline,
  });
  try {
    const addingNewTask = await newTask.save();
    res.status(200).json(newTask);
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};

// updating details for the task in the database with the id
export const updateTask = async (req, res) => {
  try {
    const query = await Task.findOneAndUpdate(
      { taskId: req.params.id },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!query) {
      res.status(400).json({ msg: "No task exists with this id !!" });
    } else {
      res.status(200).json(query);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

// deleting task from the database with the given id
export const deleteTask = async (req, res) => {
  try {
    const query = await Task.findOneAndDelete({ taskId: req.params.id });
    if (!query) {
      res.status(400).json({ msg: "No task exists with this id !!" });
    } else {
      res.status(200).json(query);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
};

// get tasks by status
export const getTasksByStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ taskStatus: status })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get task by date of creation
export const getTasksByCreationDate = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      taskCreatedAt: {
        $gte: new Date(date), // Assuming searching for tasks created on or after the given date
      },
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by creation date:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get tasks by date of deadline
export const getTasksByDeadlineDate = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      taskDeadline: {
        $lte: new Date(date), // Assuming searching for tasks due on or before the given date
      },
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by deadline date:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get tasks by task title search
export const getTasksByName = async (req, res) => {
  try {
    const { title, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      taskName: { $regex: title, $options: "i" }, // Using case-insensitive regex to search by title
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by title:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Function to update task statuses from "Pending" to "Missed" if the deadline has passed
const updateMissedTasks = async () => {
  try {
    const currentDateTime = new Date();
    const missedTasks = await Task.updateMany(
      {
        taskStatus: "Pending",
        taskDeadline: { $lt: currentDateTime },
      },
      { $set: { taskStatus: "Missed" } }
    );

    console.log(`${missedTasks.modifiedCount} tasks updated to Missed status.`);
  } catch (error) {
    console.error("Error updating task statuses:", error);
  }
};

// Schedule the task to run every midnight (00:00 am)
cron.schedule(
  "0 0 * * *",
  () => {
    updateMissedTasks();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set the timezone to India (IST)
  }
);