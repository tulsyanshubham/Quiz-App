import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    phone: number;
    gender: string;
    dob: Date;
    occupation: string;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username must be at most 20 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: {
        type: Number,
        required: [true, "Phone number is required"],
        length: [10, "Phone number must be 10 digits long"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"],
    },
    occupation: {
        type: String,
        enum: ["Student", "Employed", "Unemployed", "Other"],
        required: true,
    },
})

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;