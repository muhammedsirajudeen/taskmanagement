import { Request, Response, NextFunction, Router } from "express";
import TaskController from "@/controller/task.controller";
import TaskRepository from "@/repository/task.repository"; // Assuming you have a TaskRepository instance
import UserRepository from "@/repository/user.repository";
import { HTTP_STATUS } from "@/constants/HttpStatus";
import { JwtUtil } from "@/util/jwt.util";
import { IUser } from "@/model/user.model";
const router = Router();
const taskController = new TaskController(new TaskRepository(), new UserRepository());

async function ManagerMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.access_token
    if (!accessToken) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
        return
    }
    const decodedUser = JwtUtil.verifyToken(accessToken) as IUser
    if (!decodedUser || decodedUser.role !== "Manager") {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
        return
    }
    req.user = decodedUser
    next()
}
async function UserMiddleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.access_token
    if (!accessToken) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
        return
    }
    const decodedUser = JwtUtil.verifyToken(accessToken) as IUser
    if (!decodedUser) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
        return
    }
    req.user = decodedUser
    next()
}

router.post("/", ManagerMiddleware, (req, res) => taskController.createTask(req, res));
router.get("/", UserMiddleware, (req, res) => taskController.getAllTasks(req, res));
router.get("/:id", UserMiddleware, (req, res) => taskController.getTaskById(req, res));
router.put("/:id", UserMiddleware, (req, res) => taskController.updateTask(req, res));
router.delete("/:id", ManagerMiddleware, (req, res) => taskController.deleteTask(req, res));

export default router;
