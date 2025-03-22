import mongoose, { Model, Document } from "mongoose";

interface PathPopulate {
    select: string
    path: string
}
export class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
    }

    async findAll(array: PathPopulate[] = []): Promise<T[]> {
        return this.model.find().populate(array).exec();
    }
    async findByFilter(filter: mongoose.FilterQuery<T>, array: PathPopulate[] = []) {
        return await this.model.find(filter).populate(array).exec()
    }
    async updateById(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, data, { new: true }).exec();
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) }).exec();
    }
}
