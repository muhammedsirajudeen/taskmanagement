import { HTTP_STATUS } from "@/constants/HttpStatus"
import { IUser } from "@/model/user.model"
import { JwtUtil } from "@/util/jwt.util"
import { NextFunction } from "express"
import { Request, Response } from "express"
export async function ManagerMiddleware(req: Request, res: Response, next: NextFunction) {
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
export async function UserMiddleware(req: Request, res: Response, next: NextFunction) {
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