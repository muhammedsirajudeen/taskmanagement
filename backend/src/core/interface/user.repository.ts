import { IUserModelType } from "@/model/user.model";
import { BaseRepository } from "../abstract/base.repository";

export interface IUserRepository extends BaseRepository<IUserModelType> {
    findByEmail: (email: string) => Promise<IUserModelType | null>
}
