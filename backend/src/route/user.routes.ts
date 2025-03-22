import { Router } from "express";
import UserController from "@/controller/user.controller";
import UserRepository from "@/repository/user.repository"; // Assuming you have a UserRepository instance

const router = Router();
const userController = new UserController(new UserRepository());

router.post("/", (req, res) => userController.createUser(req, res));
router.get("/", (req, res) => userController.getUsers(req, res));
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.put("/:id", (req, res) => userController.updateUser(req, res));
router.delete("/:id", (req, res) => userController.deleteUser(req, res));

export default router;
