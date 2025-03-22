import { Router } from "express";
import TaskController from "@/controller/task.controller";
import TaskRepository from "@/repository/task.repository"; // Assuming you have a TaskRepository instance

const router = Router();
const taskController = new TaskController(new TaskRepository());

router.post("/", (req, res) => taskController.createTask(req, res));
router.get("/", (req, res) => taskController.getAllTasks(req, res));
router.get("/:id", (req, res) => taskController.getTaskById(req, res));
router.put("/:id", (req, res) => taskController.updateTask(req, res));
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));

export default router;
