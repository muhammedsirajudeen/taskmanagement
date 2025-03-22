import TaskModel, { ITask } from "@/model/task.model";
import { BaseRepository } from "@/core/abstract/base.repository";
import { ITaskRepository } from "@/core/interface/task.repository";

export default class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor() {
        super(TaskModel);
    }
}

