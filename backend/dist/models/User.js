import { randomUUID } from "crypto";
import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID,
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: JSON,
        required: true,
    },
});
const dashboardSchema = new mongoose.Schema({
    pulseRate: {
        type: String,
    },
    age: {
        type: String,
    },
    temperature: {
        type: String,
    },
    weight: {
        type: String,
    },
    bloodPressure: {
        type: String,
    },
    pregnancies: {
        type: String,
    },
    glucose: {
        type: String,
    },
    skinThickness: {
        type: String,
    },
    insulin: {
        type: String,
    },
    BMI: {
        type: String,
    },
    diabetesPedigree: {
        type: String,
    },
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [chatSchema],
    dashboard: dashboardSchema,
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map