import UserModel, { IUserModelType } from "@/model/user.model";
import { BaseRepository } from "@/core/abstract/base.repository";
import { IUserRepository } from "@/core/interface/user.repository";

export default class UserRepository extends BaseRepository<IUserModelType> implements IUserRepository {
    constructor() {
        super(UserModel);
    }
    async findByEmail(email: string) {
        return await UserModel.findOne({ email })
    }
}
