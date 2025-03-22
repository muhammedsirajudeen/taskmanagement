import mongoose, { Schema, Document } from "mongoose";

export interface ITask {
    _id: string;
    title: string;
    description: string;
    assignee: string;
    assignedBy: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    createdAt: string;
}
export interface ITaskModelType extends Document, Omit<ITask, "_id" | "assignee" | "assignedBy"> {
    assignee: mongoose.Types.ObjectId
    assignedBy: mongoose.Types.ObjectId
}

const TaskSchema = new Schema<ITaskModelType>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        assignee: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
        assignedBy: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
        dueDate: { type: String, required: true },
        priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITaskModelType>("Task", TaskSchema);
