import { Request, Response } from "express";
import { IUserRepository } from "@/core/interface/user.repository";
import { HTTP_STATUS } from "@/constants/HttpStatus";
import { BcryptUtil } from "@/util/bcrypt.util";
import { JwtUtil } from "@/util/jwt.util";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { IUserModelType, Stripped } from "@/model/user.model";

async function getGoogleProfile(token: string) {
    const response = await (await fetch("https://www.googleapis.com/oauth2/v2/userinfo",
        {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )).json()
    return response
}
class UserController {
    repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async createUser(req: Request, res: Response) {
        try {
            const request = req.body
            const userDto: Stripped<IUserModelType> = {
                email: request.email,
                password: await BcryptUtil.hashPassword(request.password),
                role: "Employee",
                name: request.name,

            }
            const user = await this.repository.create(userDto);
            res.status(HTTP_STATUS.CREATED).json({ ...user.toObject(), password: undefined });
        } catch (error) {
            const controllerError = error as Error
            if (controllerError.message.includes("E11000")) {
                res.status(HTTP_STATUS.CONFLICT).json({ message: "User already exists" })
                return
            }
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating user", error });
        }
    }
    async Login(req: Request, res: Response) {
        try {
            const request = req.body
            const userDto = {
                email: request.email,
                password: request.password
            }
            const user = await this.repository.findByEmail(userDto.email)
            if (!user) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "user not found" })
                return
            }
            if (!await BcryptUtil.comparePassword(userDto.password, user.password)) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "invalid credentials" })
                return
            }
            const token = JwtUtil.generateToken({ ...user.toObject(), password: undefined })
            res.cookie('access_token', token, { sameSite: "none", httpOnly: true, secure: process.env.NODE_ENV === "production" ? true : false })
            res.status(HTTP_STATUS.OK).json({ message: "user verified", user: { ...user.toObject(), password: undefined } })
        } catch (error) {
            const controllerError = error as Error

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'error signing in', error: controllerError.message })
        }
    }

    // {
    //        id: '102188446710307923475',
    //        email: 'dummyhunterr@gmail.com',
    //        verified_email: true,
    //        name: 'dummy hunter',
    //        given_name: 'dummy',
    //        family_name: 'hunter',
    //        picture: 'https://lh3.googleusercontent.com/a/ACg8ocKEUQ14BQFTjjo86i6ZENbE2n0DgFY1hdAe2t5DA02bROSZgQ=s96-c'
    //  }
    async googleSignupUser(req: Request, res: Response) {
        try {
            const { token } = req.body
            if (!token) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const response = await getGoogleProfile(token)
            console.log(response)
            const hashedPassword = await BcryptUtil.hashPassword(response.id)
            const savedUser = await this.repository.create({ email: response.email, name: response.name, role: "Employee", access_token: token, password: hashedPassword })
            res.status(HTTP_STATUS.CREATED).json({ message: "User signed in ", user: { ...savedUser, password: undefined } })
        } catch (error) {
            console.log(error)
            const controllerError = error as Error
            if (controllerError.message.includes("E11000")) {
                res.status(HTTP_STATUS.CONFLICT).json({ message: "User already exists" })
                return
            }
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error signing user", error })
        }
    }
    async googleSigninUser(req: Request, res: Response) {
        try {
            const { token } = req.body
            if (!token) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const profile = await getGoogleProfile(token)
            if (!profile) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const user = await this.repository.findByEmail(profile.email)
            if (!user) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "please signin" })
                return
            }
            const jwtToken = await JwtUtil.generateToken({ ...user.toObject(), password: undefined })
            await this.repository.updateById(user.id, { access_token: token })
            res.cookie('access_token', jwtToken, { sameSite: "none", httpOnly: true, secure: process.env.NODE_ENV === "production" ? true : false })
            res.status(HTTP_STATUS.OK).json({ message: 'Signed in', user: { ...user, password: undefined }, token: jwtToken })
        } catch (error) {
            console.log(error)
            const controllerError = error as Error
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "please try again", error: controllerError.message })
        }
    }
    async VerifyToken(req: Request, res: Response) {
        try {
            const bearerToken = req.cookies.access_token
            if (!bearerToken) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "user not authorized" })
                return
            }
            const decodedUser = JwtUtil.verifyToken(bearerToken)
            res.status(HTTP_STATUS.OK).json({ message: "token verified", user: decodedUser })
        } catch (error) {
            console.log(error)
            const controllerError = error as Error
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "please try again", error: controllerError.message })
        }
    }
    logoutHandler(req: Request, res: Response) {
        try {
            console.log(req.url)
            res.cookie('access_token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: "none" })
            res.status(HTTP_STATUS.OK).json({ message: "success" })
        } catch (error) {
            console.log(error)
            const controllerError = error as Error
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "please try again", error: controllerError.message })
        }
    }
    async AddRoleAndManager(req: Request, res: Response) {
        try {
            const user = req.user
            console.log(user)
            if (!user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const { id } = req.params
            if (!id || !isObjectIdOrHexString(id)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "pass a valid id" })
                return
            }
            const toUpdateUser = await this.repository.findById(id)
            if (!toUpdateUser) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "user not found" })
                return
            }
            const { role, manager } = req.body
            toUpdateUser.role = role
            toUpdateUser.manager = new mongoose.Types.ObjectId(manager as string)
            await toUpdateUser.save()
            res.status(HTTP_STATUS.OK).json({ message: "success" })
        } catch (error) {
            console.log(error)
            const controllerError = error as Error
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "please try again", error: controllerError.message })
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            console.log(req.url)
            const users = await this.repository.findAll([{ path: 'manager', select: 'username email' }]);
            //unoptimized approach
            const withoutPassword = users.map((user) => ({ ...user.toObject(), password: undefined }))
            res.status(HTTP_STATUS.OK).json({ users: withoutPassword });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching users", error });
        }
    }
    async getUserByManager(req: Request, res: Response) {
        try {
            const user = req.user
            if (!user || user.role !== "Manager") {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" })
                return
            }
            const users = await this.repository.findByFilter({ manager: new mongoose.Types.ObjectId(user._id as string) },
                [
                    { path: 'manager', select: 'username email' }
                ]
            )
            res.status(HTTP_STATUS.OK).json({ message: "Ok", users: users })
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
