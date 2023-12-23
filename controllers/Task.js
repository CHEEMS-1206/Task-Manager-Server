// Controllers for tasks '/' after URL => http://localhost:5000/api/

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