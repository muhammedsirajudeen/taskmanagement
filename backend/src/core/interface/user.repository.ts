import { IUser } from "@/model/user.model";
import { BaseRepository } from "../abstract/base.repository";

export interface IUserRepository extends BaseRepository<IUser> {
    findByEmail: (email: string) => Promise<IUser | null>
}
