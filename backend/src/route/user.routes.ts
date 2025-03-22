import { Router } from "express";
import UserController from "@/controller/user.controller";
import UserRepository from "@/repository/user.repository"; // Assuming you have a UserRepository instance

const router = Router();
const userController = new UserController(new UserRepository());

router.post("/google/signup", (req, res) => userController.googleSignupUser(req, res))
router.post("/google/signin", (req, res) => userController.googleSigninUser(req, res))
router.get("/verify", (req, res) => userController.VerifyToken(req, res))
router.post("/", (req, res) => userController.createUser(req, res));
router.get("/all", (req, res) => userController.getUsers(req, res));
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.put("/:id", (req, res) => userController.updateUser(req, res));
router.delete("/:id", (req, res) => userController.deleteUser(req, res));

export default router;
