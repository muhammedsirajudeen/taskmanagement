import TaskModel, { ITaskModelType } from "@/model/task.model";
import { BaseRepository } from "@/core/abstract/base.repository";
import { ITaskRepository } from "@/core/interface/task.repository";

export default class TaskRepository extends BaseRepository<ITaskModelType> implements ITaskRepository {
    constructor() {
        super(TaskModel);
    }
}

