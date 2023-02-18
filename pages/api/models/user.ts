import mongoose, { mongo } from "mongoose";

export interface User {
    name: string,
    phone: string,
}

const userSchema = new mongoose.Schema<User>({
    name: String,
    phone: String,
});

export default mongoose.models.User || mongoose.model<User>('User', userSchema, 'users');
