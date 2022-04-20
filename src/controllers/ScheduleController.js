import ScheduleModel from "../models/ScheduleModel.js";
import { createSchema, updateSchema } from "./validations/ScheduleSchemas.js";
import { setHours, setMinutes, addHours } from "date-fns";

class ScheduleController {
    async findAll(request, response) {
        try {
            const schedules = await ScheduleModel.find();
            return response.send(schedules);
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ message: "Internal server error" });
        }
    }

    async create(request, response) {
        const schemaValidation = createSchema.validate(request.body, {
            abortEarly: false,
        });
        if (schemaValidation.error) {
            return response.status(400).json({
                error: schemaValidation.error.details.map(
                    ({ message }) => message,
                ),
                message: "Invalid data",
            });
        }

        try {
            const { scheduledTo, name, bornDate, email } = request.body;

            let start = new Date(scheduledTo);
            start = setHours(start, 0);
            start = setMinutes(start, 0);
            start = addHours(start, -3);

            let end = new Date(scheduledTo);
            end = setMinutes(end, 59);
            end = setHours(end, 20);

            const daySchedules = await ScheduleModel.count({
                scheduledTo: {
                    $gte: start,
                    $lte: end,
                },
            });
            if (daySchedules >= 20) {
                return response
                    .status(406)
                    .json({ message: "Daily schedules limit exceeded" });
            }

            const hourSchedules = await ScheduleModel.count({
                scheduledTo: { $eq: scheduledTo },
            });
            if (hourSchedules >= 2) {
                return response
                    .status(406)
                    .json({ message: "Schedules per hour limit exceeded" });
            }

            const schedule = await ScheduleModel.create({
                scheduledTo,
                name,
                bornDate,
                email,
            });

            return response.json({ message: "Schedule created", schedule });
        } catch (error) {
            console.error(error);
            return response
                .status(400)
                .json({ message: "Bad Request: invalid body", error });
        }
    }

    async update(request, response) {
        const schemaValidation = updateSchema.validate(request.body, {
            abortEarly: false,
        });
        if (schemaValidation.error) {
            return response.status(400).json({
                error: schemaValidation.error.details.map(
                    ({ message }) => message,
                ),
                message: "Invalid data",
            });
        }

        try {
            const { id } = request.params;
            const { status, observation } = request.body;
            const schedule = await ScheduleModel.findByIdAndUpdate(
                id,
                { status, observation },
                {
                    new: true,
                },
            );

            if (!schedule) {
                return response
                    .status(404)
                    .json({ message: "Schedule not found" });
            }

            return response.send(schedule);
        } catch (error) {
            console.error(error);
            return response
                .status(500)
                .json({ message: "Internal server error" });
        }
    }
}

export default ScheduleController;
