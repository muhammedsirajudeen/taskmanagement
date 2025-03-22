import { Router } from "express";
import UserController from "@/controller/user.controller";
import UserRepository from "@/repository/user.repository"; // Assuming you have a UserRepository instance
import { ManagerMiddleware, UserMiddleware } from "@/middleware/middlewares";

const router = Router();
const userController = new UserController(new UserRepository());
router.post("/signup", (req, res) => userController.createUser(req, res))
router.post("/signin", (req, res) => userController.Login(req, res))
router.post("/google/signup", (req, res) => userController.googleSignupUser(req, res))
router.post("/google/signin", (req, res) => userController.googleSigninUser(req, res))
router.get("/verify", (req, res) => userController.VerifyToken(req, res))
router.post("/", UserMiddleware, (req, res,) => userController.createUser(req, res));
router.put(`/:id/role`, ManagerMiddleware, (req, res) => userController.AddRoleAndManager(req, res))
router.get("/all", UserMiddleware, (req, res) => userController.getUsers(req, res));
router.get("/managed/all", ManagerMiddleware, (req, res) => userController.getUserByManager(req, res))
router.get("/:id", UserMiddleware, (req, res) => userController.getUserById(req, res));
router.put("/:id", UserMiddleware, (req, res) => userController.updateUser(req, res));
router.delete("/:id", ManagerMiddleware, (req, res) => userController.deleteUser(req, res));

export default router;
