import ScheduleModel from "../models/ScheduleModel.js";
import { createSchema, updateSchema } from "./validations/ScheduleSchemas.js";
import { setHours, setMinutes, addHours } from "date-fns";

class ScheduleController {
    async findAll(request, response) {
        /*
            #swagger.tags = ['Schedules']
            #swagger.summary = 'Get all the schedules.'
            #swagger.description = 'Route for find all the schedules.'
        */
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
        /*
            #swagger.tags = ['Schedules']
            #swagger.summary = 'Create a new schedule.'
            #swagger.description = 'Route for create a new schedule.<br/>The maximum of schedules allowed per day is 20 and the maximum schedules allowed per hour is 2.'
        */
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
        /*
            #swagger.tags = ['Schedules']
            #swagger.summary = 'Update status and observation attributes of an existent schedule.'
            #swagger.description = 'Route for update an existent schedule.<br/>It allows to modify status ("Atendido" or "Não Atendido") and the orservation about the schedule.<br/>Example: "Atendido"
            <br/><br/>
            Attributes:<br/><br/>
             <b>status:</b><br/>
             <ul>
                <li>in: body,</li>
                <li>description: Attendance status.</li>
                <li>required: true,</li>
                <li>type: string</li>
                <li>enum: ["Atendido", "Não Atendido"]</li>
            </ul>
            <br/>
            <br/>
            <b>observation:</b><br/>
            <ul>
                <li>in: body,</li>
                <li>description: Observation about the attendance.</li>
                <li>required: false,</li>
                <li>type: string</li>
            </ul>
            '
        */
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
