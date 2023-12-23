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

export default taskRouter;