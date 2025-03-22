import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    id: string;
    title: string;
    description: string;
    assignee: string;
    assignedBy: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    createdAt: string;
}

const TaskSchema = new Schema<ITask>(
    {
        id: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        assignee: { type: String, required: true },
        assignedBy: { type: String, required: true },
        dueDate: { type: String, required: true },
        priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
