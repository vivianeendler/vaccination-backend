import ScheduleModel from "../model/ScheduleModel.js";

class ScheduleController {
    async findAll(request, response) {
        const schedules = await ScheduleModel.find();
        response.send(schedules);
    }

    async create(request, response) {
        const { scheduletTo, name, bornDate, email } = request.body;

        const schedule = await ScheduleModel.create({
            scheduletTo,
            name,
            bornDate,
            email,
        });
        response.send({ message: "Schedule created" }, schedule);
    }
}

export default ScheduleController;
