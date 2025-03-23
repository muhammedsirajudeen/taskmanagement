import { HTTP_STATUS } from "@/constants/HttpStatus";
import { Request, Response } from "express";
import { ITaskRepository } from "@/core/interface/task.repository";
import { IUser, Stripped } from "@/model/user.model";
import { ITaskModelType } from "@/model/task.model";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { JwtUtil } from "@/util/jwt.util";
import { IUserRepository } from "@/core/interface/user.repository";
interface GoogleCalendarEvent {
    summary: string
    description?: string
    start: {
        dateTime: string
        timeZone: string
    }
    end: {
        dateTime: string
        timeZone: string
    }
    attendees?: { email: string }[]
    status?: "confirmed" | "tentative" | "cancelled"
    priority?: "Low" | "Medium" | "High"
}

export default class TaskController {
    constructor(private taskRepository: ITaskRepository, private userRepository: IUserRepository) {

    }

    async createTask(req: Request, res: Response) {
        try {
            const accessToken = req.cookies.access_token
            if (!accessToken) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const decodedUser = JwtUtil.verifyToken(accessToken) as IUser
            if (!decodedUser || decodedUser.role !== "Manager") {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Unauthorized" })
                return
            }
            const taskDto = {
                title: req.body.title,
                description: req.body.description,
                assignee: new mongoose.Types.ObjectId(req.body.assignee as string),
                assignedBy: new mongoose.Types.ObjectId(decodedUser._id),
                status: "Pending",
                dueDate: req.body.dueDate,
                priority: req.body.priority
            } as Stripped<ITaskModelType>
            const event: GoogleCalendarEvent = {
                summary: taskDto.title,
                description: taskDto.description,
                start: {
                    dateTime: new Date().toISOString(),
                    timeZone: "UTC"
                },
                end: {
                    dateTime: new Date(taskDto.dueDate).toISOString(),
                    timeZone: "UTC"
                },
            }
            if (decodedUser.access_token) {
                //write logic for creating an event in google calendar for both assignee and assignedBy
                await (await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${decodedUser.access_token}`
                        },
                        body: JSON.stringify(event)
                    }
                )).json()


            }
            const assignedUser = await this.userRepository.findById(taskDto.assignee.toHexString())
            if (assignedUser?.access_token) {
                await (await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${assignedUser.access_token}`
                        },
                        body: JSON.stringify(event)
                    }
                )).json()
            }
            const task = await this.taskRepository.create(taskDto);
            res.status(HTTP_STATUS.CREATED).json(task);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating task", error });
        }
    }

    async getAllTasks(req: Request, res: Response) {
        try {
            console.log(req.url)
            const user = req.user
            if (!user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            if (user.role === "Employee") {
                const tasks = await this.taskRepository.findByFilter({ assignee: new mongoose.Types.ObjectId(user._id) }, [
                    { 'path': 'assignee', select: 'email name' },
                    { 'path': 'assignedBy', select: 'email name' },
                ])
                console.log(user._id)
                res.status(HTTP_STATUS.OK).json({ tasks: tasks, message: "success" })
                return
            }
            const tasks = await this.taskRepository.findByFilter({ assignedBy: new mongoose.Types.ObjectId(user._id) }, [
                { 'path': 'assignee', select: 'email name' },
                { 'path': 'assignedBy', select: 'email name' },
            ]);
            res.status(HTTP_STATUS.OK).json({ tasks: tasks });
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
            const taskToUpdate = await this.taskRepository.findById(req.params.id)
            console.log(taskToUpdate)
            if (!req.params.id || !isObjectIdOrHexString(req.params.id)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Bad request" })
                return
            }
            if (taskToUpdate?.assignedBy.toHexString() === req.user?._id || taskToUpdate?.assignee.toHexString() === req.user?._id) {
                const updatedTask = await this.taskRepository.updateById(req.params.id, req.body);
                if (!updatedTask) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                    return
                }
                res.status(HTTP_STATUS.OK).json(updatedTask);
            } else {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return

            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating task", error });
        }
    }
    async updateTaskStatus(req: Request, res: Response) {
        try {
            const taskToUpdate = await this.taskRepository.findById(req.params.id)
            console.log(taskToUpdate)
            if (!req.params.id || !isObjectIdOrHexString(req.params.id)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Bad request" })
                return
            }
            if (taskToUpdate?.assignedBy.toHexString() === req.user?._id || taskToUpdate?.assignee.toHexString() === req.user?._id) {
                const taskDTO: Partial<ITaskModelType> = {
                    status: req.body.status
                }
                const updatedTask = await this.taskRepository.updateById(req.params.id, taskDTO);
                if (!updatedTask) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                    return
                }
                res.status(HTTP_STATUS.OK).json(updatedTask);
            } else {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return

            }
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating task", error });
        }
    }

    async deleteTask(req: Request, res: Response) {
        try {
            const deletedTask = await this.taskRepository.deleteById(req.params.id);
            console.log(deletedTask)
            if (!deletedTask) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Task not found" });
                return
            }
            console.log(req.user?._id)
            if (deletedTask.assignedBy.toHexString() !== req.user?._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden" })
                return
            }
            res.status(HTTP_STATUS.OK).json({ message: "Task deleted successfully" });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error deleting task", error });
        }
    }
}
