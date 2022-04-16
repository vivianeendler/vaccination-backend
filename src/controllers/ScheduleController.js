import ScheduleModel from "../models/ScheduleModel.js";
import { createSchema, updateSchema } from "./validations/ScheduleSchemas.js";

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
