import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "Manager" | "Employee";
    access_token: string
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["Manager", "Employee"], required: true },
        access_token: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
