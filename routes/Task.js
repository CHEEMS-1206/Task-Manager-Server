import express from "express";
import bodyParser from "body-parser";

// import controllers for task
import * as taskControllers from "../controllers/EmbedApproach.js";

// define router
const taskRouter = express.Router();

taskRouter.get("/verify-token",taskControllers.tokenVerification);
taskRouter.get("/all-tasks", taskControllers.getAllTasks);
taskRouter.get("/task/:taskId", taskControllers.getTask);
taskRouter.post("/task", taskControllers.postTask);
taskRouter.put("/task/:taskId", taskControllers.updateTask);
taskRouter.patch("/task/:taskId", taskControllers.updateTask);
taskRouter.delete("/task/:taskId", taskControllers.deleteTask);

// special routes
taskRouter.get("/task-by-status", taskControllers.getTasksByStatus);
taskRouter.get("/task-by-create-date", taskControllers.getTasksByCreationDate);
taskRouter.get("/task-by-deadline-date", taskControllers.getTasksByDeadlineDate);
taskRouter.get("/task-by-title", taskControllers.getTasksByName);
taskRouter.get("/analytics",taskControllers.getAllTasksForAnalytics)

export default taskRouter;