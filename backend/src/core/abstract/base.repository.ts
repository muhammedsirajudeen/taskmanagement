import { Model, Document } from "mongoose";

export class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findOne({ id }).exec();
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async updateById(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findOneAndUpdate({ id }, data, { new: true }).exec();
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findOneAndDelete({ id }).exec();
    }
}
