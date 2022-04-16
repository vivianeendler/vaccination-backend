import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        scheduletTo: { type: Date, min: Date.now(), required: true },
        name: { type: String, maxLength: 150, required: true },
        bornDate: { type: Date, max: Date.now(), required: true },
        email: { type: String, maxLength: 200 },
        status: {
            type: String,
            enum: ["Atendido", "Não Atendido"],
            default: "Não Atendido",
        },
        observation: { type: String, maxLength: 200, default: null },
    },
    {
        timestamps: true,
    },
);

const ScheduleModel = mongoose.model("schedule", ScheduleSchema);

export default ScheduleModel;
