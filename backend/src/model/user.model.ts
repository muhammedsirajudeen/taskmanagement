import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "Manager" | "Employee";
    access_token?: string
    manager?: string
}
export interface IUserModelType extends Omit<IUser, "manager"> {
    manager?: mongoose.Types.ObjectId
}
export type Stripped<T> = Omit<T, keyof Document | "_id">;

const UserSchema = new Schema<IUserModelType>(
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
        },
        manager: {
            type: mongoose.Schema.ObjectId,
            required: false,
            ref: 'User'
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUserModelType>("User", UserSchema);
