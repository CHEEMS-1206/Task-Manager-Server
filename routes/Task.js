import express from "express";
import bodyParser from "body-parser";

// import controllers for task
import * as taskControllers from "../controllers/Task.js";

// define router
const taskRouter = express.Router();

taskRouter.get("/all-tasks", taskControllers.getAllTasks);
taskRouter.get("/task/:id", taskControllers.getTask);
taskRouter.post("/task", taskControllers.postTask);
taskRouter.put("/task/:id", taskControllers.updateTask);
taskRouter.patch("/task/:id", taskControllers.updateTask);
taskRouter.delete("/task/:id", taskControllers.deleteTask);

// special routes
taskRouter.get("/task-by-status", taskControllers.getTasksByStatus);
taskRouter.get("/task-by-create-date", taskControllers.getTasksByCreationDate);
taskRouter.get("/task-by-deadline-date", taskControllers.getTasksByDeadlineDate);
taskRouter.get("/task-by-title", taskControllers.getTasksByName);
taskRouter.get("/analytics",taskControllers.getAllTasksForAnalytics)

export default taskRouter;