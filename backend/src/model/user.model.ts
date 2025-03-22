import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    role: "Manager" | "Employee";
}

const UserSchema = new Schema<IUser>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["Manager", "Employee"], required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
