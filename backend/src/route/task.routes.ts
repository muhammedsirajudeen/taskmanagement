import { Router } from "express";
import TaskController from "@/controller/task.controller";
import TaskRepository from "@/repository/task.repository"; // Assuming you have a TaskRepository instance
import UserRepository from "@/repository/user.repository";
import { ManagerMiddleware, UserMiddleware } from "@/middleware/middlewares";
const router = Router();
const taskController = new TaskController(new TaskRepository(), new UserRepository());


router.post("/", ManagerMiddleware, (req, res) => taskController.createTask(req, res));
router.get("/", UserMiddleware, (req, res) => taskController.getAllTasks(req, res));
router.patch("/status/:id", UserMiddleware, (req, res) => taskController.updateTaskStatus(req, res))
router.get("/:id", UserMiddleware, (req, res) => taskController.getTaskById(req, res));
router.put("/:id", UserMiddleware, (req, res) => taskController.updateTask(req, res));
router.delete("/:id", ManagerMiddleware, (req, res) => taskController.deleteTask(req, res));

export default router;
