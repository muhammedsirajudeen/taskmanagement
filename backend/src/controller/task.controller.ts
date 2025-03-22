import { HTTP_STATUS } from "@/constants/HttpStatus";
import { Request, Response } from "express";
import { ITaskRepository } from "@/core/interface/task.repository";

export default class TaskController {
    constructor(private taskRepository: ITaskRepository) { }

    async createTask(req: Request, res: Response) {
        try {
            const task = await this.taskRepository.create(req.body);
            res.status(HTTP_STATUS.CREATED).json(task);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating task", error });
        }
    }

    async getAllTasks(req: Request, res: Response) {
        try {
            const tasks = await this.taskRepository.findAll();
            res.status(HTTP_STATUS.OK).json(tasks);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error retrieving tasks", error });
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const task = await this.taskRepository.findById(req.params.id);
            if (!task) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json(task);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error retrieving task", error });
        }
    }

    async updateTask(req: Request, res: Response) {
        try {
            const updatedTask = await this.taskRepository.updateById(req.params.id, req.body);
            if (!updatedTask) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json(updatedTask);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating task", error });
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const deletedTask = await this.taskRepository.deleteById(req.params.id);
            if (!deletedTask) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error deleting task", error });
        }
    }
}
