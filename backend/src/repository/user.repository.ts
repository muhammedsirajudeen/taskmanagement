import UserModel, { IUser } from "@/model/user.model";
import { BaseRepository } from "@/core/abstract/base.repository";
import { IUserRepository } from "@/core/interface/user.repository";

export default class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(UserModel);
    }
}
