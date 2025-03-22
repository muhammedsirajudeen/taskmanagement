import { Request, Response } from "express";
import { IUserRepository } from "@/core/interface/user.repository";
import { HTTP_STATUS } from "@/constants/HttpStatus";

class UserController {
    repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await this.repository.create(req.body);
            res.status(HTTP_STATUS.CREATED).json(user);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating user", error });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.repository.findAll();
            res.status(HTTP_STATUS.OK).json(users);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching users", error });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await this.repository.findById(req.params.id);
            if (!user) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json(user);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching user", error });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const updatedUser = await this.repository.updateById(req.params.id, req.body);
            if (!updatedUser) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json(updatedUser);
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating user", error });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const deletedUser = await this.repository.deleteById(req.params.id);
            if (!deletedUser) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
                return
            }
            res.status(HTTP_STATUS.OK).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error deleting user", error });
        }
    }
}

export default UserController;
